import { test as base, expect } from '@playwright/test';
import { loginAsAdmin, loginAsCustomer } from '../helpers/auth-helpers';

type TestFixtures = {
  authenticatedAsCustomer: void;
  authenticatedAsAdmin: void;
};

export const test = base.extend<TestFixtures>({
  authenticatedAsCustomer: async ({ page }, use) => {
    await loginAsCustomer(page);
    await use();
  },
  authenticatedAsAdmin: async ({ page }, use) => {
    await loginAsAdmin(page);
    await use();
  },
});

export { expect };