export const TEST_USERS = {
  admin: {
    email: 'admin@test.com',
    password: 'Testing123!',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  },
  customer1: {
    email: 'john@test.com',
    password: 'Testing123!',
    firstName: 'John',
    lastName: 'Doe',
    role: 'customer',
  },
  customer2: {
    email: 'jane@test.com',
    password: 'Testing123!',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'customer',
  },
};

export const TEST_DATA = {
  validProduct: {
    name: 'Test Product',
    price: '499.99',
    stockQuantity: 50,
    description: 'A test product',
    category: 'CPU',
  },
  validBrand: {
    name: 'TestBrand',
    logoUrl: '/store-branding/logo.png',
  },
  validProfile: {
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Test St',
    city: 'Test City',
    state: 'TC',
    country: 'Test Country',
  },
};

export const PRODUCT_CATEGORIES = [
  'CPU',
  'GPU',
  'RAM',
  'Storage',
  'Motherboards',
  'Power',
  'Cooling',
  'Cases',
  'Accessories',
];

export const ARGON2_CONFIG = {
  memoryCost: 65536, // 64 MB
  timeCost: 3,
  parallelism: 4,
  outputLen: 32,
  algorithm: 'Argon2id',
};

export const ERROR_MESSAGES = {
  unauthorized: '401',
  forbidden: '403',
  notFound: '404',
  badRequest: '400',
  invalidEmail: 'Invalid email',
  weakPassword: 'Password too weak',
  insufficientStock: 'Insufficient stock',
  emptyCart: 'Cart is empty',
};