import { test, expect } from './fixtures';
import { loginAsCustomer, loginAsAdmin } from '../helpers/auth-helpers';
import { TEST_USERS } from '../helpers/constants';

test.describe('Authorization & Role-Based Access Control', () => {
  test('customer cannot access admin page', async ({ page }) => {
    await loginAsCustomer(page);
    
    await page.goto('/admin');
    await page.waitForURL('**/', { timeout: 5000 });
    
    // Should be redirected away from admin
    expect(page.url()).not.toContain('/admin');
  });

  test('customer receives 403 on admin API endpoints', async ({ authenticatedAsCustomer, page }) => {
    const response = await page.request.post('/api/products/admin', {
      data: {
        productName: 'Test',
        brandName: 'Test',
        category: 'CPU',
        price: '99.99',
        stockQuantity: 10,
      },
    });
    
    expect(response.status()).toBe(403);
  });

  test('non-authenticated user cannot access profile page', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForURL('**/', { timeout: 5000 });
    
    expect(page.url()).toBe('http://localhost:3000/');
  });

  test('non-authenticated user cannot access cart page', async ({ page }) => {
    await page.goto('/cart');
    await page.waitForURL('**/', { timeout: 5000 });
    
    expect(page.url()).toBe('http://localhost:3000/');
  });

  test('non-authenticated user cannot access admin page', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForURL('**/', { timeout: 5000 });
    
    expect(page.url()).not.toContain('/admin');
  });

  test('non-authenticated user receives 401 on protected endpoints', async ({ page }) => {
    const response = await page.request.get('/api/user/cart');
    
    expect(response.status()).toBe(401);
  });

  test('admin can access admin page', async ({ page }) => {
    await loginAsAdmin(page);
    
    await page.goto('/admin');
    
    expect(page.url()).toContain('/admin');
    await expect(page.getByRole('heading', { name: 'Manage Products' })).toBeVisible();
  });

  test('admin can create products via API', async ({ authenticatedAsAdmin, page }) => {
    const response = await page.request.post('/api/products/admin', {
      data: {
        productName: `Test Product ${Date.now()}`,
        brandName: 'AMD',
        category: 'CPU',
        price: '499.99',
        stockQuantity: 10,
        description: 'Test product from admin',
      },
    });
    
    expect(response.status()).toBe(201);
    
    const product = await response.json();
    expect(product.id).toBeTruthy();
  });

  test('admin can create brands via API', async ({ authenticatedAsAdmin, page }) => {
    const response = await page.request.post('/api/brands', {
      data: {
        name: `TestBrand${Date.now()}`,
      },
    });
    
    expect(response.status()).toBe(201);
  });

  test('customer cannot create products', async ({ authenticatedAsCustomer, page }) => {
    const response = await page.request.post('/api/products/admin', {
      data: {
        productName: 'Unauthorised Product',
        brandName: 'AMD',
        category: 'CPU',
        price: '499.99',
        stockQuantity: 10,
      },
    });
    
    expect(response.status()).toBe(403);
  });

  test('customer cannot create brands', async ({ authenticatedAsCustomer, page }) => {
    const response = await page.request.post('/api/brands', {
      data: {
        name: `UnauthorisedBrand${Date.now()}`,
      },
    });
    
    expect(response.status()).toBe(403);
  });

  test('unauthenticated user receives 401 on admin create product', async ({ page }) => {
    const response = await page.request.post('/api/products/admin', {
      data: {
        productName: 'Test',
        brandName: 'Test',
        category: 'CPU',
        price: '99.99',
      },
    });
    
    expect(response.status()).toBe(401);
  });

  test('role preserved across session refresh', async ({ authenticatedAsAdmin, page }) => {
    let session = await page.request.get('/api/auth/session');
    let sessionData = await session.json();
    const adminRole = sessionData.session?.user?.role;
    
    await page.reload();
    
    session = await page.request.get('/api/auth/session');
    sessionData = await session.json();
    
    expect(sessionData.session?.user?.role).toBe(adminRole);
    expect(adminRole).toBe('admin');
  });
});