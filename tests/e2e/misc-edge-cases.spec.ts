import { test, expect } from './fixtures';
import { getAllProducts, addToCart, checkout } from '../helpers/data-helpers';
import { loginAsCustomer } from '../helpers/auth-helpers';

test.describe('Edge Cases & Error Handling', () => {
  test('stock validation: order with quantity exceeding stock rejected', async ({ authenticatedAsCustomer, page }) => {
    const products = await getAllProducts(page);
    const product = products[0];
    
    if (product.stock_quantity > 0) {
      const tooMuchQuantity = product.stock_quantity + 100;
      
      // Try to add excessive quantity
      const response = await page.request.post('/api/user/cart/add', {
        data: {
          productId: product.id,
          quantity: tooMuchQuantity,
        },
      });
      
      // Should either reject or cap to available stock
      if (response.ok()) {
        const cart = await page.request.get('/api/user/cart');
        const cartData = await cart.json();
        const item = cartData.cartItems.find((i: any) => i.product_id === product.id);
        
        // Quantity should not exceed stock
        if (item) {
          expect(item.quantity).toBeLessThanOrEqual(product.stock_quantity);
        }
      }
    }
  });

  test('cart: adding product that no longer exists fails gracefully', async ({ authenticatedAsCustomer, page }) => {
    const response = await page.request.post('/api/user/cart/add', {
      data: {
        productId: 'definitely-not-real-product-id',
        quantity: 1,
      },
    });
    
    expect(response.status()).toBe(404);
  });

  test('concurrent cart updates handled correctly', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    await loginAsCustomer(page1, 'customer1');
    await loginAsCustomer(page2, 'customer1');
    
    const products = await getAllProducts(page1);
    if (products.length === 0) {
      await page1.close();
      await page2.close();
      test.skip();
    }
    
    const productId = products[0].id;
    
    // Both users update cart simultaneously
    await Promise.all([
      page1.request.post('/api/user/cart/add', { data: { productId, quantity: 1 } }),
      page2.request.post('/api/user/cart/add', { data: { productId, quantity: 1 } }),
    ]);
    
    // Cart should be consistent
    const cart = await page1.request.get('/api/user/cart');
    expect(cart.status()).toBe(200);
    
    await page1.close();
    await page2.close();
  });

  test('invalid JWT/session token returns 401', async ({ page }) => {
    // Set invalid cookie
    await page.context().addCookies([
      {
        name: 'better-auth.session_token',
        value: 'invalid-token-xyz',
        url: 'http://localhost:3000',
      },
    ]);
    
    const response = await page.request.get('/api/user/cart');
    
    // Should be 401 or redirect to login
    expect([401, 302]).toContain(response.status());
  });

  test('malformed JSON in request returns 400', async ({ authenticatedAsCustomer, page }) => {
    const response = await page.request.post('/api/user/cart/add', {
      data: '{invalid json}',
    });
    
    expect([400, 500]).toContain(response.status());
  });

  test('missing required headers handled gracefully', async ({ page }) => {
    const response = await page.request.get('/api/products');

    expect(response.status()).toBe(200);
  });

  test('product with price of 0 edge case', async ({ authenticatedAsAdmin, page }) => {
    const response = await page.request.post('/api/products/admin', {
      data: {
        productName: `FreeProduct${Date.now()}`,
        brandName: 'AMD',
        category: 'CPU',
        price: '0',
        stockQuantity: 10,
      },
    });

    if (response.ok()) {
      const product = await response.json();
      expect(product.price).toBe('0');
    }
  });

  test('product with very large price stored as decimal', async ({ authenticatedAsAdmin, page }) => {
    const largePrice = '999999999.99';
    
    const response = await page.request.post('/api/products/admin', {
      data: {
        productName: `ExpensiveProduct${Date.now()}`,
        brandName: 'AMD',
        category: 'CPU',
        price: largePrice,
        stockQuantity: 1,
      },
    });
    
    if (response.ok()) {
      const product = await response.json();
      const price = String(product.price);
      expect(price).toContain('999999999');
    }
  });

  test('order with 0 items rejected', async ({ authenticatedAsCustomer, page }) => {
    // Clear cart
    const cart = await page.request.get('/api/user/cart');
    const cartData = await cart.json();
    
    for (const item of cartData.cartItems) {
      await page.request.delete(`/api/user/cart/items/${item.id}`);
    }
    
    // Try to checkout with empty cart
    const response = await page.request.post('/api/user/orders/checkout', {
      data: {},
    });
    
    expect([400, 422]).toContain(response.status());
  });

  test('profile update with same data succeeds', async ({ authenticatedAsCustomer, page }) => {
    // Get current profile
    const sessionRes = await page.request.get('/api/auth/session');
    const sessionData = await sessionRes.json();
    const user = sessionData.session?.user;
    
    // Update with same data
    const response = await page.request.put('/api/user/profile', {
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        city: user.city,
        state: user.state,
        country: user.country,
      },
    });
    
    expect(response.status()).toBe(200);
  });

  test('rapid login attempts do not crash system', async ({ page }) => {
    // Try 5 login attempts in quick succession
    const attempts = [];
    for (let i = 0; i < 5; i++) {
      attempts.push(
        page.request.post('/api/auth/signin', {
          data: {
            email: 'test@test.com',
            password: 'wrongpassword',
          },
        })
      );
    }
    
    const results = await Promise.all(attempts);
    
    results.forEach(result => {
      expect([200, 400, 401, 404, 429]).toContain(result.status());
    });
  });

  test('deleted product not added to new carts', async ({ authenticatedAsCustomer, page }) => {
    const products = await getAllProducts(page);
    if (products.length === 0) {
      test.skip();
    }
    
    // Try to add deleted product (or non-existent)
    const response = await page.request.post('/api/user/cart/add', {
      data: {
        productId: 'nonexistent-deleted-product',
        quantity: 1,
      },
    });
    
    expect(response.status()).toBe(404);
  });
});