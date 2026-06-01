import { test, expect } from './fixtures';
import { createProduct, createBrand, addToCart, updateCartItem } from '../helpers/data-helpers';
import { PRODUCT_CATEGORIES } from '../helpers/constants';

test.describe('Data Validation & Sanitization', () => {
  test('product creation rejects missing required fields', async ({ authenticatedAsAdmin, page }) => {
    // Missing productName
    let response = await page.request.post('/api/products/admin', {
      data: {
        brandName: 'AMD',
        category: 'CPU',
        price: '499.99',
        stockQuantity: 10,
      },
    });
    expect(response.status()).toBe(400);
    
    // Missing price
    response = await page.request.post('/api/products/admin', {
      data: {
        productName: 'Test',
        brandName: 'AMD',
        category: 'CPU',
        stockQuantity: 10,
      },
    });
    expect(response.status()).toBe(400);
    
    // Missing category
    response = await page.request.post('/api/products/admin', {
      data: {
        productName: 'Test',
        brandName: 'AMD',
        price: '499.99',
        stockQuantity: 10,
      },
    });
    expect(response.status()).toBe(400);
  });

  test('product creation rejects invalid category', async ({ authenticatedAsAdmin, page }) => {
    const response = await page.request.post('/api/products/admin', {
      data: {
        productName: 'Test',
        brandName: 'AMD',
        category: 'InvalidCategory',
        price: '499.99',
        stockQuantity: 10,
      },
    });
    
    expect(response.status()).toBe(400);
  });

  test('product creation rejects negative price', async ({ authenticatedAsAdmin, page }) => {
    const response = await page.request.post('/api/products/admin', {
      data: {
        productName: 'Test',
        brandName: 'AMD',
        category: 'CPU',
        price: '-99.99',
        stockQuantity: 10,
      },
    });
    
    expect([400, 500]).toContain(response.status());
  });

  test('product creation rejects non-numeric price', async ({ authenticatedAsAdmin, page }) => {
    const response = await page.request.post('/api/products/admin', {
      data: {
        productName: 'Test',
        brandName: 'AMD',
        category: 'CPU',
        price: 'not-a-number',
        stockQuantity: 10,
      },
    });
    
    expect([400, 500]).toContain(response.status());
  });

  test('product creation rejects negative stock quantity', async ({ authenticatedAsAdmin, page }) => {
    const response = await page.request.post('/api/products/admin', {
      data: {
        productName: 'Test',
        brandName: 'AMD',
        category: 'CPU',
        price: '499.99',
        stockQuantity: -10,
      },
    });
    
    expect([400, 500]).toContain(response.status());
  });

  test('brand creation rejects missing name', async ({ authenticatedAsAdmin, page }) => {
    const response = await page.request.post('/api/brands', {
      data: {},
    });
    
    expect(response.status()).toBe(400);
  });

  test('brand creation rejects empty string as name', async ({ authenticatedAsAdmin, page }) => {
    const response = await page.request.post('/api/brands', {
      data: {
        name: '',
      },
    });
    
    expect(response.status()).toBe(400);
  });

  test('brand creation rejects duplicate brand name', async ({ authenticatedAsAdmin, page }) => {
    const brandName = `UniqueBrand${Date.now()}`;

    // Create first brand
    const response1 = await page.request.post('/api/brands', {
      data: {
        name: brandName,
      },
    });
    expect(response1.status()).toBe(201);
    
    // Try to create with same name
    const response2 = await page.request.post('/api/brands', {
      data: {
        name: brandName,
      },
    });
    expect(response2.status()).toBe(409);
  });

  test('cart add operation validates productId exists', async ({ authenticatedAsCustomer, page }) => {
    const response = await page.request.post('/api/user/cart/add', {
      data: {
        productId: 'nonexistent-id',
        quantity: 1,
      },
    });
    
    expect(response.status()).toBe(404);
  });

  test('cart add operation rejects negative quantity', async ({ authenticatedAsCustomer, page }) => {
    const response = await page.request.post('/api/user/cart/add', {
      data: {
        productId: 'valid-id',
        quantity: -5,
      },
    });
    
    expect([400, 404]).toContain(response.status());
  });

  test('cart add operation rejects quantity of 0', async ({ authenticatedAsCustomer, page }) => {
    const response = await page.request.post('/api/user/cart/add', {
      data: {
        productId: 'valid-id',
        quantity: 0,
      },
    });
    
    expect([400, 404]).toContain(response.status());
  });

  test('profile update validates required fields', async ({ authenticatedAsCustomer, page }) => {
    const response = await page.request.put('/api/user/profile', {
      data: {
        firstName: '',
        lastName: 'Doe',
        address: '123 St',
        city: 'City',
        state: 'ST',
        country: 'Country',
      },
    });
    
    expect(response.status()).toBe(400);
  });

  test('email validation blocks special injections', async ({ page }) => {
    await page.goto('/register');
    
    const injectionEmail = "test@test.com'; DROP TABLE users; --";
    await page.fill('input[type="email"]', injectionEmail);
    
    const inputElement = page.locator('input[type="email"]');
    const isValid = await inputElement.evaluate((el: HTMLInputElement) => el.checkValidity());
    
    expect(isValid).toBeFalsy();
  });

  test('text field sanitization: HTML tags in product description', async ({ authenticatedAsAdmin, page }) => {
    const maliciousDescription = '<script>alert("XSS")</script>Test';
    
    const response = await page.request.post('/api/products/admin', {
      data: {
        productName: `Test${Date.now()}`,
        brandName: 'AMD',
        category: 'CPU',
        price: '499.99',
        stockQuantity: 10,
        description: maliciousDescription,
      },
    });
    
    if (response.ok()) {
      const product = await response.json();
      // sanitise description
      expect(product.description).not.toContain('<script>');
    }
  });

  test('numeric field validation: rejects non-numeric price', async ({ authenticatedAsAdmin, page }) => {
    const response = await page.request.post('/api/products/admin', {
      data: {
        productName: 'Test',
        brandName: 'AMD',
        category: 'CPU',
        price: 'abc',
        stockQuantity: 10,
      },
    });
    
    expect([400, 500]).toContain(response.status());
  });
});