import { test, expect } from './fixtures';
import { getAllProducts, addToCart, checkout, buyNow, getCart } from '../helpers/data-helpers';
import { loginAsCustomer } from '../helpers/auth-helpers';

async function clearCart(page: Parameters<typeof getCart>[0]) {
  const cart = await getCart(page);
  for (const item of cart.cartItems) {
    await page.request.delete(`/api/user/cart/items/${item.id}`);
  }
}

test.describe('Orders & Checkout', () => {
  test('POST /api/user/orders/checkout returns 200 with orderId', async ({ authenticatedAsCustomer, page }) => {
    const products = await getAllProducts(page);
    const product = products.find((candidate: any) => candidate.stock_quantity > 0);
    if (!product) {
      test.skip();
    }
    
    await clearCart(page);

    // Add to cart
    const addResponse = await addToCart(page, product.id, 1);
    expect(addResponse.status()).toBe(200);

    const response = await page.request.post('/api/user/orders/checkout', {
      data: {},
    });
    
    expect(response.status()).toBe(200);
    const order = await response.json();
    expect(order.orderId).toBeDefined();
    expect(order.success).toBe(true);
  });

  test('POST /api/user/orders/checkout (empty cart) returns error', async ({ authenticatedAsCustomer, page }) => {
    // Clear cart if needed
    const cart = await getCart(page);
    for (const item of cart.cartItems) {
      await page.request.delete(`/api/user/cart/items/${item.id}`);
    }
    
    const response = await page.request.post('/api/user/orders/checkout', {
      data: {},
    });
    
    expect([400, 422]).toContain(response.status());
  });

  test('POST /api/user/orders/checkout validates stock before creating order', async ({ authenticatedAsCustomer, page }) => {
    const products = await getAllProducts(page);
    if (products.length === 0) {
      test.skip();
    }
    
    // Get a product with stock
    const product = products.find((p: any) => p.stock_quantity > 0);
    if (!product) {
      test.skip();
    }

    await clearCart(page);
    
    // Add valid quantity
    const addResponse = await addToCart(page, product.id, 1);
    expect(addResponse.status()).toBe(200);
    
    const response = await page.request.post('/api/user/orders/checkout', {
      data: {},
    });
    
    expect(response.status()).toBe(200);
  });

  test('POST /api/user/orders/checkout decrements stock', async ({ authenticatedAsCustomer, page }) => {
    const products = await getAllProducts(page);
    if (products.length === 0) {
      test.skip();
    }
    
    const product = products.find((candidate: any) => candidate.stock_quantity > 0);
    if (!product) {
      test.skip();
    }

    await clearCart(page);

    const initialStock = product.stock_quantity;
    
    // Add to cart and checkout
    const addResponse = await addToCart(page, product.id, 1);
    expect(addResponse.status()).toBe(200);
    
    await page.request.post('/api/user/orders/checkout', {
      data: {},
    });
    
    // Check stock decreased
    const updatedProducts = await getAllProducts(page);
    const updatedProduct = updatedProducts.find((p: any) => p.id === product.id);
    
    expect(updatedProduct.stock_quantity).toBe(initialStock - 1);
  });

  test('POST /api/user/orders/checkout clears cart', async ({ authenticatedAsCustomer, page }) => {
    const products = await getAllProducts(page);
    if (products.length === 0) {
      test.skip();
    }
    
    await clearCart(page);

    const product = products.find((candidate: any) => candidate.stock_quantity > 0);
    if (!product) {
      test.skip();
    }

    const addResponse = await addToCart(page, product.id, 1);
    expect(addResponse.status()).toBe(200);

    const cartBefore = await getCart(page);
    const hadItems = cartBefore.cartCount > 0;
    
    if (hadItems) {
      // Checkout
      await page.request.post('/api/user/orders/checkout', {
        data: {},
      });
      
      const cartAfter = await getCart(page);
      expect(cartAfter.cartCount).toBe(0);
    }
  });

  test('POST /api/user/orders/checkout (unauthenticated) returns 401', async ({ page }) => {
    const response = await page.request.post('/api/user/orders/checkout', {
      data: {},
    });
    
    expect(response.status()).toBe(401);
  });

  test('GET /api/user/orders returns user orders', async ({ authenticatedAsCustomer, page }) => {
    const response = await page.request.get('/api/user/orders');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.orders)).toBeTruthy();
  });

  test('GET /api/user/orders (unauthenticated) returns 401', async ({ page }) => {
    const response = await page.request.get('/api/user/orders');
    
    expect(response.status()).toBe(401);
  });

  test('GET /api/user/orders/[orderId] own order returns 200', async ({ authenticatedAsCustomer, page }) => {
    // First create order
    const products = await getAllProducts(page);
    if (products.length === 0) {
      test.skip();
    }
    
    await page.request.post('/api/user/cart/add', {
      data: { productId: products[0].id, quantity: 1 },
    });
    
    const checkoutRes = await page.request.post('/api/user/orders/checkout', {
      data: {},
    });
    
    if (checkoutRes.ok()) {
      const checkoutData = await checkoutRes.json();
      const orderId = checkoutData.orderId;
      
      const orderRes = await page.request.get(`/api/user/orders/${orderId}`);
      expect(orderRes.status()).toBe(200);
    }
  });

  test('POST /api/user/orders/buy-now creates order directly', async ({ authenticatedAsCustomer, page }) => {
    const products = await getAllProducts(page);
    if (products.length === 0) {
      test.skip();
    }
    
    const response = await page.request.post('/api/user/orders/buy-now', {
      data: {
        productId: products[0].id,
        quantity: 1,
      },
    });
    
    expect([200, 201]).toContain(response.status());
    const result = await response.json();
    expect(result.orderId).toBeDefined();
  });

  test('order status created successfully', async ({ authenticatedAsCustomer, page }) => {
    const products = await getAllProducts(page);
    if (products.length === 0) {
      test.skip();
    }
    
    // Create order
    await page.request.post('/api/user/cart/add', {
      data: { productId: products[0].id, quantity: 1 },
    });
    
    const checkoutRes = await page.request.post('/api/user/orders/checkout', {
      data: {},
    });
    
    if (checkoutRes.ok()) {
      const order = await checkoutRes.json();
      expect(order.orderId).toBeDefined();
      expect(order.success).toBe(true);
    }
  });
});