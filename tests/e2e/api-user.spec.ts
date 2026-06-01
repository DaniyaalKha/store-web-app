import { test, expect } from './fixtures';
import { updateProfile } from '../helpers/data-helpers';
import { loginAsCustomer } from '../helpers/auth-helpers';
import { TEST_USERS } from '../helpers/constants';

test.describe('User Profile API', () => {
  test('GET /api/auth/session (authenticated) returns current user', async ({ authenticatedAsCustomer, page }) => {
    const response = await page.request.get('/api/auth/session');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.session?.user?.email).toBe(TEST_USERS.customer1.email);
    expect(data.session?.user?.firstName).toBeDefined();
    expect(data.session?.user?.lastName).toBeDefined();
  });

  test('GET /api/auth/session (unauthenticated) returns null', async ({ page }) => {
    const response = await page.request.get('/api/auth/session');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.session).toBeNull();
  });

  test('PUT /api/user/profile updates user fields', async ({ authenticatedAsCustomer, page }) => {
    const response = await updateProfile(page, {
      firstName: 'UpdatedName',
      lastName: 'UpdatedLast',
      address: '999 New St',
      city: 'New City',
      state: 'NC',
      country: 'New Country',
    });
    
    expect(response.status()).toBe(200);
    
    // Verify update persisted
    const session = await page.request.get('/api/auth/session');
    const data = await session.json();
    expect(data.session?.user?.firstName).toBe('UpdatedName');
    expect(data.session?.user?.address).toBe('999 New St');
  });

  test('PUT /api/user/profile (missing fields) returns 400', async ({ authenticatedAsCustomer, page }) => {
    const response = await page.request.put('/api/user/profile', {
      data: {
        firstName: '', // Empty required field
        lastName: 'Doe',
        address: '123 St',
        city: 'City',
        state: 'ST',
        country: 'Country',
      },
    });
    
    expect(response.status()).toBe(400);
  });

  test('PUT /api/user/profile (unauthenticated) returns 401', async ({ page }) => {
    const response = await page.request.put('/api/user/profile', {
      data: {
        firstName: 'Test',
        lastName: 'User',
        address: '123 St',
        city: 'City',
        state: 'ST',
        country: 'Country',
      },
    });
    
    expect(response.status()).toBe(401);
  });

  test('profile password change with correct current password', async ({ page }) => {
    const newPassword = 'NewPass123';
    const originalPassword = TEST_USERS.customer2.password;

    await loginAsCustomer(page, 'customer2');

    const response = await updateProfile(page, {
      firstName: 'Jane',
      lastName: 'Smith',
      address: '123 St',
      city: 'City',
      state: 'ST',
      country: 'Country',
      currentPassword: originalPassword,
      newPassword,
    });

    expect(response.status()).toBe(200);

    await updateProfile(page, {
      firstName: 'Jane',
      lastName: 'Smith',
      address: '123 St',
      city: 'City',
      state: 'ST',
      country: 'Country',
      currentPassword: newPassword,
      newPassword: originalPassword,
    });
  });

  test('profile password change with wrong current password fails', async ({ page }) => {
    await loginAsCustomer(page, 'customer2');

    const response = await updateProfile(page, {
      firstName: 'Jane',
      lastName: 'Smith',
      address: '123 St',
      city: 'City',
      state: 'ST',
      country: 'Country',
      currentPassword: 'WrongPassword123',
      newPassword: 'NewPass123',
    });
    
    expect(response.status()).toBe(400);
  });

  test('profile password change validates new password non-empty', async ({ page }) => {
    await loginAsCustomer(page, 'customer2');

    const response = await updateProfile(page, {
      firstName: 'Jane',
      lastName: 'Smith',
      address: '123 St',
      city: 'City',
      state: 'ST',
      country: 'Country',
      currentPassword: TEST_USERS.customer2.password,
      newPassword: '',
    });
    
    expect([400, 422]).toContain(response.status());
  });
});