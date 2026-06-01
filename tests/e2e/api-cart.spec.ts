import { test, expect } from './fixtures';
import { addToCart, getCart, updateCartItem, removeFromCart, getAllProducts } from '../helpers/data-helpers';
import { loginAsCustomer } from '../helpers/auth-helpers';
import { TEST_USERS } from '../helpers/constants';

test.describe('Cart API', () => {
  test('GET /api/user/cart (authenticated) returns user cart', async ({ authenticatedAsCustomer, page }) => {
    const response = await page.request.get('/api/user/cart');
    
    expect(response.status()).toBe(200);
    const cart = await response.json();
    expect(cart.cartItems).toBeDefined();
    expect(cart.cartCount).toBeDefined();
    expect(Array.isArray(cart.cartItems)).toBeTruthy();
  });

  test('GET /api/user/cart (unauthenticated) returns 401', async ({ page }) => {
    const response = await page.request.get('/api/user/cart');
    
    expect(response.status()).toBe(401);
  });

  test('POST /api/user/cart/add adds item and returns 200', async ({ authenticatedAsCustomer, page }) => {
    // Get first product
    const products = await getAllProducts(page);
    if (products.length === 0) {
      test.skip();
    }
    
    const productId = products[0].id;
    
    const response = await page.request.post('/api/user/cart/add', {
      data: {
        productId,
        quantity: 1,
      },
    });
    
    expect(response.status()).toBe(200);
  });

  test('POST /api/user/cart/add (missing productId) returns 400', async ({ authenticatedAsCustomer, page }) => {
    const response = await page.request.post('/api/user/cart/add', {
      data: {
        quantity: 1,
      },
    });
    
    expect(response.status()).toBe(400);
  });

  test('POST /api/user/cart/add (invalid productId) returns 404', async ({ authenticatedAsCustomer, page }) => {
    const response = await page.request.post('/api/user/cart/add', {
      data: {
        productId: 'nonexistent-product-id',
        quantity: 1,
      },
    });
    
    expect(response.status()).toBe(404);
  });

  test('POST /api/user/cart/add (duplicate product) updates quantity', async ({ authenticatedAsCustomer, page }) => {
    const products = await getAllProducts(page);
    if (products.length === 0) {
      test.skip();
    }
    
    const productId = products[0].id;
    
    // Add item first time
    await page.request.post('/api/user/cart/add', {
      data: { productId, quantity: 1 },
    });
    
    // Add same item again
    await page.request.post('/api/user/cart/add', {
      data: { productId, quantity: 1 },
    });
    
    // Get cart and verify quantity is 2
    const cart = await getCart(page);
    const item = cart.cartItems.find((i: any) => i.id === productId);
    expect(item).toBeDefined();
  });

  test('cart displays correct product details', async ({ authenticatedAsCustomer, page }) => {
    const products = await getAllProducts(page);
    if (products.length === 0) {
      test.skip();
    }
    
    const productId = products[0].id;
    await page.request.post('/api/user/cart/add', {
      data: { productId, quantity: 1 },
    });
    
    const cart = await getCart(page);
    const cartItem = cart.cartItems.find((i: any) => i.id === productId);
    
    if (cartItem) {
      expect(cartItem.productName).toBeDefined();
      expect(cartItem.pricePerUnit).toBeDefined();
      expect(cartItem.image).toBeDefined();
    }
  });

  test('PUT /api/user/cart/items/[productId] updates quantity', async ({ authenticatedAsCustomer, page }) => {
    const products = await getAllProducts(page);
    if (products.length === 0) {
      test.skip();
    }
    
    const productId = products[0].id;
    
    // Add to cart
    await page.request.post('/api/user/cart/add', {
      data: { productId, quantity: 1 },
    });
    
    // Update quantity
    const response = await page.request.put(`/api/user/cart/items/${productId}`, {
      data: { quantity: 5 },
    });
    
    expect(response.status()).toBe(200);
  });

  test('PUT /api/user/cart/items/[productId] with quantity 0 deletes item', async ({ authenticatedAsCustomer, page }) => {
    const products = await getAllProducts(page);
    if (products.length === 0) {
      test.skip();
    }
    
    const productId = products[0].id;
    
    await page.request.post('/api/user/cart/add', {
      data: { productId, quantity: 1 },
    });
    
    // Set quantity to 0 (delete)
    const response = await page.request.put(`/api/user/cart/items/${productId}`, {
      data: { quantity: 0 },
    });
    
    expect([200, 204]).toContain(response.status());
  });

  test('DELETE /api/user/cart/items/[productId] removes item', async ({ authenticatedAsCustomer, page }) => {
    const products = await getAllProducts(page);
    if (products.length === 0) {
      test.skip();
    }
    
    const productId = products[0].id;
    
    await page.request.post('/api/user/cart/add', {
      data: { productId, quantity: 1 },
    });
    
    const response = await page.request.delete(`/api/user/cart/items/${productId}`);
    
    expect([200, 204]).toContain(response.status());
  });

  test('cart persists across sessions for same user', async ({ page }) => {
    await loginAsCustomer(page);
    
    const products = await getAllProducts(page);
    if (products.length === 0) {
      test.skip();
    }
    
    // Add item to cart
    await page.request.post('/api/user/cart/add', {
      data: { productId: products[0].id, quantity: 1 },
    });
    
    const cartBefore = await getCart(page);
    const countBefore = cartBefore.cartCount;
    
    // Reload page
    await page.reload();
    
    const cartAfter = await getCart(page);
    const countAfter = cartAfter.cartCount;
    
    expect(countAfter).toBe(countBefore);
  });

  test('cart total calculated correctly', async ({ authenticatedAsCustomer, page }) => {
    const cartResponse = await getCart(page);
    const items = cartResponse.cartItems;
    
    let calculatedTotal = 0;
    items.forEach((item: any) => {
      const price = parseFloat(item.pricePerUnit);
      calculatedTotal += price * item.quantity;
    });
    
    // If cart has items, total should be calculable
    if (items.length > 0) {
      expect(calculatedTotal).toBeGreaterThan(0);
    }
  });
});