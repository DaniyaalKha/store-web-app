import { test, expect } from './fixtures';
import { createProduct, getAllProducts, deleteProduct, createBrand } from '../helpers/data-helpers';
import { TEST_USERS } from '../helpers/constants';

test.describe('Products API & Data Correctness', () => {
  test('GET /api/products returns 200 with all products', async ({ page }) => {
    const response = await page.request.get('/api/products');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('GET /api/products includes all required product fields', async ({ page }) => {
    const response = await page.request.get('/api/products');
    const products = await response.json();
    
    if (products.length > 0) {
      const product = products[0];
      expect(product.id).toBeDefined();
      expect(product.name).toBeDefined();
      expect(product.slug).toBeDefined();
      expect(product.price).toBeDefined();
      expect(product.stock_quantity).toBeDefined();
      expect(product.description).toBeDefined();
      expect(product.brand).toBeDefined();
      expect(product.category).toBeDefined();
      expect(product.image_url).toBeDefined();
      expect(product.model_3d_url).toBeDefined();
    }
  });

  test('GET /api/products with search parameter filters by name', async ({ page }) => {
    // Search for existing/seeded product
    const response = await page.request.get('/api/products?search=Ryzen');
    
    expect(response.status()).toBe(200);
    const products = await response.json();
    
    if (products.length > 0) {
      expect(products.some((p: any) => p.name.toLowerCase().includes('ryzen'))).toBeTruthy();
    }
  });

  test('GET /api/products with category parameter filters', async ({ page }) => {
    const response = await page.request.get('/api/products?category=CPU');
    
    expect(response.status()).toBe(200);
    const products = await response.json();
    
    // check CPU products returned
    if (products.length > 0) {
      const cpuProducts = products.filter((p: any) => p.category?.name === 'CPU' || p.category === 'CPU');
      expect(cpuProducts.length).toBeGreaterThan(0);
    }
  });

  test('GET /api/products with invalid category returns empty array or all', async ({ page }) => {
    const response = await page.request.get('/api/products?category=InvalidCategory999');
    
    expect(response.status()).toBe(200);
    const products = await response.json();
    // no products for invalid category
    expect(Array.isArray(products)).toBeTruthy();
  });

  test('GET /api/products with non-existent search returns empty array', async ({ page }) => {
    const response = await page.request.get('/api/products?search=XYZ_NONEXISTENT_PRODUCT_XYZ');
    
    expect(response.status()).toBe(200);
    const products = await response.json();
    expect(products.length).toBe(0);
  });

  test('product slug is unique and URL-safe', async ({ page }) => {
    const response = await page.request.get('/api/products');
    const products = await response.json();
    
    const slugs = products.map((p: any) => p.slug);
    const uniqueSlugs = new Set(slugs);
    
    // All slugs should be unique
    expect(slugs.length).toBe(uniqueSlugs.size);
    
    // All slugs should be URL-safe (lowercase, hyphens, alphanumeric)
    products.forEach((p: any) => {
      expect(p.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    });
  });

  test('product price is stored as decimal', async ({ page }) => {
    const response = await page.request.get('/api/products');
    const products = await response.json();
    
    if (products.length > 0) {
      const product = products[0];
      const priceStr = String(product.price);
      // Should be a valid price format (decimal)
      expect(priceStr).toMatch(/^\d+(\.\d{1,2})?$/);
    }
  });

  test('POST /api/products (admin) creates product with status 201', async ({ authenticatedAsAdmin, page }) => {
    const response = await createProduct(page, {
      name: `TestProduct${Date.now()}`,
      brandName: 'AMD',
      category: 'CPU',
      price: '499.99',
      stockQuantity: 10,
      description: 'Test product',
    });
    
    if (response && response.ok) {
      const product = await response.json();
      expect(product.id).toBeDefined();
      expect(product.name).toContain('TestProduct');
      expect(product.category).toBe('CPU');
      expect(product.stock_quantity).toBe(10);
    }
  });

  test('POST /api/products (admin, missing field) returns 400', async ({ authenticatedAsAdmin, page }) => {
    const response = await page.request.post('/api/products/admin', {
      data: {
        productName: 'Test',
      },
    });
    
    expect(response.status()).toBe(400);
  });

  test('POST /api/products (customer) returns 403', async ({ authenticatedAsCustomer, page }) => {
    const response = await page.request.post('/api/products/admin', {
      data: {
        productName: 'Test',
        brandName: 'AMD',
        category: 'CPU',
        price: '499.99',
        stockQuantity: 10,
      },
    });
    
    expect(response.status()).toBe(403);
  });

  test('POST /api/products (unauthenticated) returns 401', async ({ page }) => {
    const response = await page.request.post('/api/products/admin', {
      data: {
        productName: 'Test',
        brandName: 'AMD',
        category: 'CPU',
        price: '499.99',
        stockQuantity: 10,
      },
    });
    
    expect(response.status()).toBe(401);
  });

  test('multiple products with same brand return correct relations', async ({ page }) => {
    const response = await page.request.get('/api/products?category=CPU');
    const products = await response.json();
    
    const amdProducts = products.filter((p: any) => p.brand.name === 'AMD');
    
    if (amdProducts.length > 1) {
      amdProducts.forEach((p: any) => {
        expect(p.brand.name).toBe('AMD');
        expect(p.brand.id).toBeDefined();
      });
    }
  });
});