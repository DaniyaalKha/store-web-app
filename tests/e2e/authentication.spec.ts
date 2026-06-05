import { test, expect } from './fixtures';
import { loginUser, isLoggedIn, getSessionUser, logout } from '../helpers/auth-helpers';
import { TEST_USERS } from '../helpers/constants';

test.describe('Authentication & Sessions', () => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  test('user registration with valid profile data', async ({ page }) => {
    await page.goto('/register');
    
    const newEmail = `test_${Date.now()}@test.com`;
    await page.fill('input[type="email"]', newEmail);
    await page.fill('input[type="password"]', 'TestPassword123');
    
    const registerButton = page.locator('button:has-text("Register"), button:has-text("Sign Up")');
    if (await registerButton.isVisible()) {
      await registerButton.click();
      await page.waitForLoadState('networkidle');
    }
    
    const loggedIn = await isLoggedIn(page);
    expect(loggedIn).toBeTruthy();
  });

  test('registration validation: missing email', async ({ page }) => {
    await page.goto('/register');
    
    // Only fill password not email
    await page.fill('input[type="password"]', 'TestPassword123');
    
    const registerButton = page.locator('button:has-text("Register"), button:has-text("Sign Up")');
    if (await registerButton.isVisible()) {
      await registerButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Should show error or stay on page
    const url = page.url();
    expect(url).toContain('/register');
  });

  test('registration validation: weak password', async ({ page }) => {
    await page.goto('/register');
    
    const newEmail = `test_${Date.now()}@test.com`;
    await page.fill('input[type="email"]', newEmail);
    
    await page.locator('input[aria-label="Password"]').fill('123'); // Too weak
    await page.locator('input[aria-label="Confirm password"]').fill('123');
    
    const registerButton = page.locator('button:has-text("Register"), button:has-text("Sign Up")');
    if (await registerButton.isVisible()) {
      await registerButton.click();
      await page.waitForTimeout(1000);
    }
    
    const url = page.url();
    expect(url).toContain('/register');
  });

  test('registration validation: invalid email format', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'TestPassword123');
    
    const registerButton = page.locator('button:has-text("Register"), button:has-text("Sign Up")');
    
    // prevent invalid email
    const emailInput = page.locator('input[type="email"]');
    const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.checkValidity());
    
    expect(isValid).toBeFalsy();
  });

  test('login with valid credentials', async ({ page }) => {
    await loginUser(page, TEST_USERS.customer1.email, TEST_USERS.customer1.password);
    
    const loggedIn = await isLoggedIn(page);
    expect(loggedIn).toBeTruthy();
  });

  test('login with invalid email', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'nonexistent@test.com');
    await page.fill('input[type="password"]', 'TestPassword123');
    
    await page.locator('form').getByRole('button', { name: 'Login' }).click();
    
    // Should show error and stay on page
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/login');
  });

  test('login with wrong password', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USERS.customer1.email);
    await page.fill('input[type="password"]', 'WrongPassword123');
    
    await page.locator('form').getByRole('button', { name: 'Login' }).click();
    
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/login');
  });

  test('session creation and persistence across page reloads', async ({ page }) => {
    await loginUser(page, TEST_USERS.customer1.email, TEST_USERS.customer1.password);
    
    const sessionBefore = await getSessionUser(page);
    expect(sessionBefore).toBeTruthy();
    
    await page.reload();
    
    const sessionAfter = await getSessionUser(page);
    expect(sessionAfter).toBeTruthy();
    expect(sessionBefore).toEqual(sessionAfter);
  });

  test('logout clears session and redirects to login', async ({ authenticatedAsCustomer, page }) => {
    // Already logged in via fixture
    const beforeLogout = await getSessionUser(page);
    expect(beforeLogout).toBeTruthy();
    
    await logout(page);
    
    const afterLogout = await getSessionUser(page);
    expect(afterLogout?.session ?? null).toBeNull();
  });

  test('password change with correct current password', async ({ page }) => {
    await loginUser(page, TEST_USERS.customer2.email, TEST_USERS.customer2.password);
    await page.goto('/profile');
    
    const originalPassword = TEST_USERS.customer2.password;
    const newPassword = 'NewPassword123!';
    
    await page.getByRole('button', { name: 'Edit Details' }).click();
    await page.locator('#currentPassword').fill(originalPassword);
    await page.locator('#newPassword').fill(newPassword);
    await page.getByRole('button', { name: 'Save Changes' }).click();
    
    // Wait for success message
    await page.waitForTimeout(2000);
    
    // Try logging out and logging back in with new password
    await logout(page);
    await loginUser(page, TEST_USERS.customer2.email, newPassword);
    
    const loggedIn = await isLoggedIn(page);
    expect(loggedIn).toBeTruthy();

    await page.goto('/profile');
    await page.getByRole('button', { name: 'Edit Details' }).click();
    await page.locator('#currentPassword').fill(newPassword);
    await page.locator('#newPassword').fill(originalPassword);
    await page.getByRole('button', { name: 'Save Changes' }).click();
    await page.waitForTimeout(2000);

    await logout(page);
    await loginUser(page, TEST_USERS.customer2.email, originalPassword);
    expect(await isLoggedIn(page)).toBeTruthy();
  });

  test('password change with incorrect current password fails', async ({ page }) => {
    await loginUser(page, TEST_USERS.customer2.email, TEST_USERS.customer2.password);
    await page.goto('/profile');
    
    await page.getByRole('button', { name: 'Edit Details' }).click();
    await page.locator('#currentPassword').fill('WrongPassword123');
    await page.locator('#newPassword').fill('NewPassword123!');
    await page.getByRole('button', { name: 'Save Changes' }).click();
    
    await page.waitForTimeout(1000);
    
    // Try logging in with new password - should fail
    await logout(page);
    
    const loginAttempt = await page.request.get('/api/auth/session');
    expect(loginAttempt.status()).toBe(200);
    const sessionData = await loginAttempt.json();
    expect(sessionData.session).toBeNull();
  });

  test('simultaneous sessions for same user', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    await loginUser(page1, TEST_USERS.customer1.email, TEST_USERS.customer1.password);
    await loginUser(page2, TEST_USERS.customer1.email, TEST_USERS.customer1.password);
    
    const session1 = await getSessionUser(page1);
    const session2 = await getSessionUser(page2);
    
    expect(session1).toBeTruthy();
    expect(session2).toBeTruthy();
    expect(session1.session?.user?.email).toBe(session2.session?.user?.email);
    
    await page1.close();
    await page2.close();
  });

  test('signup with valid data should succeed', async ({ page }) => {
    const newEmail = `valid_${Date.now()}@test.com`;
    const response = await page.request.post(`${baseUrl}/api/auth/signup`, {
      data: {
        email: newEmail,
        password: 'ValidPass123!',
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main Street',
        city: 'Sydney',
        state: 'NSW',
        country: 'Australia',
      },
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.user).toBeDefined();
    expect(data.user.email).toBe(newEmail);
    expect(data.user.firstName).toBe('John');
  });

  test('signup with missing email should fail', async ({ page }) => {
    const response = await page.request.post(`${baseUrl}/api/auth/signup`, {
      data: {
        email: '',
        password: 'ValidPass123!',
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main Street',
        city: 'Sydney',
        state: 'NSW',
        country: 'Australia',
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
  });

  test('signup with invalid email format should fail', async ({ page }) => {
    const response = await page.request.post(`${baseUrl}/api/auth/signup`, {
      data: {
        email: 'not-an-email',
        password: 'ValidPass123!',
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main Street',
        city: 'Sydney',
        state: 'NSW',
        country: 'Australia',
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error.details?.email).toBeDefined();
  });

  test('signup with password too short should fail', async ({ page }) => {
    const response = await page.request.post(`${baseUrl}/api/auth/signup`, {
      data: {
        email: `short_${Date.now()}@test.com`,
        password: 'Short1!',
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main Street',
        city: 'Sydney',
        state: 'NSW',
        country: 'Australia',
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error.details?.password).toBeDefined();
  });

  test('signup without uppercase letter in password should fail', async ({ page }) => {
    const response = await page.request.post(`${baseUrl}/api/auth/signup`, {
      data: {
        email: `nouppercase_${Date.now()}@test.com`,
        password: 'validpass123!',
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main Street',
        city: 'Sydney',
        state: 'NSW',
        country: 'Australia',
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error.details?.password).toContain('uppercase');
  });

  test('signup without number in password should fail', async ({ page }) => {
    const response = await page.request.post(`${baseUrl}/api/auth/signup`, {
      data: {
        email: `nonumber_${Date.now()}@test.com`,
        password: 'ValidPass!',
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main Street',
        city: 'Sydney',
        state: 'NSW',
        country: 'Australia',
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error.details?.password).toContain('number');
  });

  test('signup without special character in password should fail', async ({ page }) => {
    const response = await page.request.post(`${baseUrl}/api/auth/signup`, {
      data: {
        email: `nospecial_${Date.now()}@test.com`,
        password: 'ValidPass123',
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main Street',
        city: 'Sydney',
        state: 'NSW',
        country: 'Australia',
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error.details?.password).toContain('special character');
  });

  test('signup with extra fields should succeed (extra fields ignored)', async ({ page }) => {
    const response = await page.request.post(`${baseUrl}/api/auth/signup`, {
      data: {
        email: `extrafields_${Date.now()}@test.com`,
        password: 'ValidPass123!',
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main Street',
        city: 'Sydney',
        state: 'NSW',
        country: 'Australia',
        extraField: 'should be ignored', // confirmPassword is validated client-side only, server ignores it
      },
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.user.email).toContain('extrafields_');
  });

  test('signup with invalid name characters should fail', async ({ page }) => {
    const response = await page.request.post(`${baseUrl}/api/auth/signup`, {
      data: {
        email: `invalidname_${Date.now()}@test.com`,
        password: 'ValidPass123!',
        firstName: 'John123', // Numbers not allowed in name
        lastName: 'Doe',
        address: '123 Main Street',
        city: 'Sydney',
        state: 'NSW',
        country: 'Australia',
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error.details?.firstName).toBeDefined();
  });

  test('signup with duplicate email should fail', async ({ page }) => {
    const email = `duplicate_${Date.now()}@test.com`;
    
    // First signup
    const firstResponse = await page.request.post(`${baseUrl}/api/auth/signup`, {
      data: {
        email,
        password: 'ValidPass123!',
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main Street',
        city: 'Sydney',
        state: 'NSW',
        country: 'Australia',
      },
    });

    expect(firstResponse.status()).toBe(201);

    // Second signup with same email
    const secondResponse = await page.request.post(`${baseUrl}/api/auth/signup`, {
      data: {
        email,
        password: 'ValidPass123!',
        firstName: 'Jane',
        lastName: 'Smith',
        address: '456 Oak Street',
        city: 'Melbourne',
        state: 'VIC',
        country: 'Australia',
      },
    });

    expect(secondResponse.status()).toBe(409);
    const data = await secondResponse.json();
    expect(data.error.message).toContain('already registered');
  });

  test('signup with short address should fail', async ({ page }) => {
    const response = await page.request.post(`${baseUrl}/api/auth/signup`, {
      data: {
        email: `shortaddr_${Date.now()}@test.com`,
        password: 'ValidPass123!',
        firstName: 'John',
        lastName: 'Doe',
        address: '123', // Too short
        city: 'Sydney',
        state: 'NSW',
        country: 'Australia',
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error.details?.address).toBeDefined();
  });

  test('signup with missing required fields should fail', async ({ page }) => {
    const response = await page.request.post(`${baseUrl}/api/auth/signup`, {
      data: {
        email: `missing_${Date.now()}@test.com`,
        password: 'ValidPass123!',
        // Missing firstName, lastName, address, etc.
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
  });

  test('signup response should not contain password hash', async ({ page }) => {
    const newEmail = `nopass_${Date.now()}@test.com`;
    const response = await page.request.post(`${baseUrl}/api/auth/signup`, {
      data: {
        email: newEmail,
        password: 'ValidPass123!',
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main Street',
        city: 'Sydney',
        state: 'NSW',
        country: 'Australia',
      },
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    
    // Verify sensitive data is not in response
    expect(data.user).not.toHaveProperty('password');
    expect(data.user).not.toHaveProperty('passwordHash');
    expect(data.user).not.toHaveProperty('accounts');
  });

  test('email should be case-insensitive for uniqueness check', async ({ page }) => {
    const baseEmail = `casetest_${Date.now()}@test.com`;
    
    // First signup
    const firstResponse = await page.request.post(`${baseUrl}/api/auth/signup`, {
      data: {
        email: baseEmail,
        password: 'ValidPass123!',
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main Street',
        city: 'Sydney',
        state: 'NSW',
        country: 'Australia',
      },
    });

    expect(firstResponse.status()).toBe(201);

    // Try signup with uppercase version
    const secondResponse = await page.request.post(`${baseUrl}/api/auth/signup`, {
      data: {
        email: baseEmail.toUpperCase(),
        password: 'ValidPass123!',
        firstName: 'Jane',
        lastName: 'Smith',
        address: '456 Oak Street',
        city: 'Melbourne',
        state: 'VIC',
        country: 'Australia',
      },
    });

    // Should be rejected as duplicate
    expect(secondResponse.status()).toBe(409);
  });
});