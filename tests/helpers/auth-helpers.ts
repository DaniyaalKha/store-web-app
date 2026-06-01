import { Page } from '@playwright/test';
import { TEST_USERS } from './constants';

export async function loginUser(page: Page, email: string, password: string) {
  // Navigate to login
  if (!page.url().includes('/login')) {
    await page.goto('/login');
  }

  const loginResponse = await page.evaluate(async ({ email, password }) => {
    const response = await fetch('/api/auth/sign-in/email', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    return {
      ok: response.ok,
      status: response.status,
      text: await response.text(),
    };
  }, { email, password });

  if (!loginResponse.ok) {
    throw new Error(`Login failed: ${loginResponse.text || loginResponse.status}`);
  }

  await page.goto('/profile').catch(() => {});
  await page.waitForLoadState('networkidle').catch(() => {});
}

export async function loginAsAdmin(page: Page) {
  return loginUser(page, TEST_USERS.admin.email, TEST_USERS.admin.password);
}

export async function loginAsCustomer(page: Page, customerKey: 'customer1' | 'customer2' = 'customer1') {
  return loginUser(page, TEST_USERS[customerKey].email, TEST_USERS[customerKey].password);
}

export async function logout(page: Page) {
  await page.evaluate(async () => {
    await fetch('/api/auth/sign-out', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }).catch(() => {});
  }).catch(() => {});

  await page.goto('/login').catch(() => {});
  await page.waitForLoadState('networkidle').catch(() => {});
}

export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    const response = await page.goto('/profile');
    return response?.status() === 200 && !page.url().includes('/login');
  } catch {
    return false;
  }
}

export async function getSessionUser(page: Page) {
  const response = await page.request.get('/api/auth/session');
  if (response.status() === 200) {
    return response.json();
  }
  return null;
}