import { Page } from '@playwright/test';

export async function createProduct(
  page: Page,
  data: {
    name: string;
    brandName: string;
    category: string;
    price: string;
    stockQuantity?: number;
    description?: string;
    imageUrl?: string;
    modelUrl?: string;
  }
) {
  const response = await page.request.post('/api/products/admin', {
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      productName: data.name,
      brandName: data.brandName,
      category: data.category,
      price: data.price,
      stockQuantity: data.stockQuantity || 10,
      description: data.description || 'Test product',
      imageUrl: data.imageUrl || '/store-branding/logo.png',
      modelUrl: data.modelUrl || '/test.glb',
    }),
  });
  return response.json();
}

export async function deleteProduct(page: Page, productId: string) {
  return page.request.delete(`/api/products/${productId}`);
}

export async function createBrand(page: Page, name: string, logoUrl?: string) {
  const response = await page.request.post('/api/brands', {
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      name,
      logoUrl: logoUrl || '/store-branding/logo.png',
    }),
  });
  return response.json();
}

export async function deleteBrand(page: Page, brandId: string) {
  return page.request.delete(`/api/brands/${brandId}`);
}

export async function getProduct(page: Page, id: string) {
  const response = await page.request.get(`/api/products/${id}`);
  return response.json();
}

export async function getAllProducts(page: Page) {
  const response = await page.request.get('/api/products');
  return response.json();
}

export async function addToCart(page: Page, productId: string, quantity: number = 1) {
  const response = await page.request.post('/api/user/cart/add', {
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      productId,
      quantity,
    }),
  });
  return response;
}

export async function getCart(page: Page) {
  const response = await page.request.get('/api/user/cart');
  return response.json();
}

export async function updateCartItem(page: Page, productId: string, quantity: number) {
  const response = await page.request.put(`/api/user/cart/items/${productId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({ quantity }),
  });
  return response;
}

export async function removeFromCart(page: Page, productId: string) {
  return page.request.delete(`/api/user/cart/items/${productId}`);
}

export async function checkout(page: Page) {
  const response = await page.request.post('/api/user/orders/checkout', {
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({}),
  });
  return response.json();
}

export async function buyNow(page: Page, productId: string, quantity: number = 1) {
  const response = await page.request.post('/api/user/orders/buy-now', {
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({ productId, quantity }),
  });
  return response.json();
}

export async function updateProfile(
  page: Page,
  data: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    currentPassword?: string;
    newPassword?: string;
  }
) {
  const response = await page.request.put('/api/user/profile', {
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data),
  });
  return response;
}