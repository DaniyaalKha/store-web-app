# Store Web App - API Documentation

## Overview

The Store Web App provides a RESTful API for managing e-commerce operations including product browsing, shopping cart management, order processing, and user authentication. The API is built with Next.js and uses PostgreSQL for data persistence.

- **Base URL**: `http://localhost:3000` (development) or your deployed domain
- **Authentication Method**: Better-Auth with email/password credentials and session-based authentication
- **Response Format**: JSON
- **Content-Type**: `application/json`

---

## Authentication

### Overview

The API uses **Better-Auth** for authentication, implementing secure email/password-based authentication with session management. All protected endpoints require an active session.

### Session Cookie

Upon successful authentication, a session cookie is automatically set by the server and must be included in subsequent requests. The session:
- Expires after 24 hours of inactivity
- Is automatically renewed if accessed within the renewal window
- Is securely stored and validated server-side

### Protected Endpoints

Protected endpoints require an active user session. If authentication fails:
- Return `401 Unauthorized` - No valid session
- Return `403 Forbidden` - User lacks required permissions (e.g., admin role)

---

## Endpoints

### Authentication Endpoints

These endpoints are handled by Better-Auth and are available at `/api/auth/*`

#### Sign Up

**Create a new user account**

- **HTTP Method**: `POST`
- **Path**: `/api/auth/sign-up`
- **Authentication**: Not required
- **Body Parameters**:
  - `email` (string, required): User's email address
  - `password` (string, required): Password (minimum 8 characters)
  - `firstName` (string, optional): User's first name
  - `lastName` (string, optional): User's last name

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Success Response** (200):
```json
{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "session": {
    "id": "session-456",
    "expiresAt": "2024-01-16T10:30:00Z"
  }
}
```

**Error Responses**:
- `400 Bad Request` - Invalid input or password too short
- `409 Conflict` - Email already exists

---

#### Sign In

**Authenticate user and create session**

- **HTTP Method**: `POST`
- **Path**: `/api/auth/sign-in`
- **Authentication**: Not required
- **Body Parameters**:
  - `email` (string, required): User's email address
  - `password` (string, required): User's password

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

**Success Response** (200):
```json
{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "role": "customer"
  },
  "session": {
    "id": "session-456",
    "expiresAt": "2024-01-16T10:30:00Z"
  }
}
```

**Error Responses**:
- `401 Unauthorized` - Invalid credentials
- `400 Bad Request` - Missing required fields

---

#### Get Session

**Retrieve current user session information**

- **HTTP Method**: `GET`
- **Path**: `/api/auth/session`
- **Authentication**: Required (session cookie)

**Example Request**:
```bash
curl -X GET http://localhost:3000/api/auth/session \
  -H "Cookie: session-cookie=..."
```

**Success Response** (200):
```json
{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "role": "customer"
  },
  "session": {
    "id": "session-456",
    "expiresAt": "2024-01-16T10:30:00Z"
  }
}
```

**Error Response**:
- `401 Unauthorized` - No valid session

---

#### Sign Out

**Terminate user session**

- **HTTP Method**: `POST`
- **Path**: `/api/auth/sign-out`
- **Authentication**: Required (session cookie)

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/auth/sign-out
```

**Success Response** (200):
```json
{ "success": true }
```

---

#### Change Password

**Update user password**

- **HTTP Method**: `POST`
- **Path**: `/api/auth/change-password`
- **Authentication**: Required (session cookie)
- **Body Parameters**:
  - `currentPassword` (string, required): Current password
  - `newPassword` (string, required): New password (minimum 8 characters)

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "OldPass123",
    "newPassword": "NewPass456"
  }'
```

**Success Response** (200):
```json
{ "success": true }
```

**Error Responses**:
- `401 Unauthorized` - Invalid current password
- `400 Bad Request` - Missing fields or password too short

---

### Brand Endpoints

#### Get All Brands

**Retrieve all available brands**

- **HTTP Method**: `GET`
- **Path**: `/api/brands`
- **Authentication**: Not required
- **Query Parameters**: None

**Example Request**:
```bash
curl -X GET http://localhost:3000/api/brands
```

**Success Response** (200):
```json
[
  {
    "id": 1,
    "name": "Intel",
    "logo_url": "/brands/intel.png"
  },
  {
    "id": 2,
    "name": "AMD",
    "logo_url": "/brands/amd.png"
  }
]
```

**Error Response**:
- `500 Internal Server Error` - Database error

---

#### Create Brand (Admin)

**Create a new product brand**

- **HTTP Method**: `POST`
- **Path**: `/api/brands`
- **Authentication**: Required (admin role)
- **Body Parameters**:
  - `name` (string, required): Brand name (HTML tags will be sanitized)
  - `logoUrl` (string, optional): URL to brand logo

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/brands \
  -H "Content-Type: application/json" \
  -d '{
    "name": "NVIDIA",
    "logoUrl": "/brands/nvidia.png"
  }'
```

**Success Response** (201):
```json
{
  "id": 3,
  "name": "NVIDIA",
  "logo_url": "/brands/nvidia.png"
}
```

**Error Responses**:
- `401 Unauthorized` - No valid session
- `403 Forbidden` - User is not admin
- `400 Bad Request` - Brand name is required
- `409 Conflict` - Brand already exists
- `500 Internal Server Error` - Database error

---

#### Update Brand (Admin)

**Update existing brand details**

- **HTTP Method**: `PUT`
- **Path**: `/api/brands/{id}`
- **Authentication**: Required (admin role)
- **Path Parameters**:
  - `id` (integer): Brand ID
- **Body Parameters**:
  - `name` (string, required): Updated brand name
  - `logoUrl` (string, optional): Updated logo URL

**Example Request**:
```bash
curl -X PUT http://localhost:3000/api/brands/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Intel Corporation",
    "logoUrl": "/brands/intel-updated.png"
  }'
```

**Success Response** (200):
```json
{
  "id": 1,
  "name": "Intel Corporation",
  "logo_url": "/brands/intel-updated.png"
}
```

**Error Responses**:
- `401 Unauthorized` - No valid session
- `403 Forbidden` - User is not admin
- `404 Not Found` - Brand not found
- `409 Conflict` - Brand name already exists
- `500 Internal Server Error` - Database error

---

#### Delete Brand (Admin)

**Remove a brand (only if no products exist)**

- **HTTP Method**: `DELETE`
- **Path**: `/api/brands/{id}`
- **Authentication**: Required (admin role)
- **Path Parameters**:
  - `id` (integer): Brand ID

**Example Request**:
```bash
curl -X DELETE http://localhost:3000/api/brands/1
```

**Success Response** (200):
```json
{ "success": true }
```

**Error Responses**:
- `401 Unauthorized` - No valid session
- `403 Forbidden` - User is not admin
- `404 Not Found` - Brand not found
- `400 Bad Request` - Brand has associated products
- `500 Internal Server Error` - Database error

---

### Product Endpoints

#### Get All Products

**Retrieve products with optional filtering**

- **HTTP Method**: `GET`
- **Path**: `/api/products`
- **Authentication**: Not required
- **Query Parameters**:
  - `search` (string, optional): Search by product name, description, or brand name
  - `category` (string, optional): Filter by category (CPU, Graphics, Memory, Storage, Motherboards, Power, Cooling, Cases, Accessories)

**Example Request**:
```bash
curl -X GET "http://localhost:3000/api/products?search=AMD&category=CPU"
```

**Success Response** (200):
```json
[
  {
    "id": 1,
    "name": "AMD Ryzen 5 5600X",
    "slug": "amd-ryzen-5-5600x-1705314600000",
    "description": "High-performance desktop processor",
    "price": "299.99",
    "image_url": "/products/ryzen-5.jpg",
    "stock_quantity": 15,
    "model_3d_url": "/models/ryzen-5.glb",
    "brand": {
      "id": 2,
      "name": "AMD",
      "logo_url": "/brands/amd.png"
    },
    "category": {
      "id": 1,
      "name": "CPU"
    }
  }
]
```

**Error Response**:
- `500 Internal Server Error` - Database error

---

#### Get Product by Slug

**Retrieve a specific product by its slug**

- **HTTP Method**: `GET`
- **Path**: `/api/products/by-slug/{slug}`
- **Authentication**: Not required
- **Path Parameters**:
  - `slug` (string): Product slug (e.g., "amd-ryzen-5-5600x-1705314600000")

**Example Request**:
```bash
curl -X GET http://localhost:3000/api/products/by-slug/amd-ryzen-5-5600x-1705314600000
```

**Success Response** (200):
```json
{
  "id": 1,
  "name": "AMD Ryzen 5 5600X",
  "slug": "amd-ryzen-5-5600x-1705314600000",
  "description": "High-performance desktop processor",
  "price": "299.99",
  "image_url": "/products/ryzen-5.jpg",
  "stock_quantity": 15,
  "model_3d_url": "/models/ryzen-5.glb",
  "brand": { "id": 2, "name": "AMD" },
  "category": { "id": 1, "name": "CPU" }
}
```

**Error Responses**:
- `400 Bad Request` - Slug is required
- `404 Not Found` - Product not found
- `500 Internal Server Error` - Database error

---

#### Create Product (Admin)

**Create a new product**

- **HTTP Method**: `POST`
- **Path**: `/api/products/admin`
- **Authentication**: Required (admin role)
- **Body Parameters**:
  - `brandName` (string, required): Brand name (auto-created if doesn't exist)
  - `productName` (string, required): Product name
  - `category` (string, required): Product category
  - `price` (number, required): Product price (must be >= 0)
  - `description` (string, optional): Product description (HTML will be sanitized)
  - `imageUrl` (string, optional): Product image URL
  - `modelUrl` (string, optional): 3D model URL
  - `stockQuantity` (integer, optional): Initial stock quantity (default: 0)

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/products/admin \
  -H "Content-Type: application/json" \
  -d '{
    "brandName": "Intel",
    "productName": "Intel Core i9-13900K",
    "category": "CPU",
    "price": 589.99,
    "description": "13th generation Intel processor",
    "imageUrl": "/products/i9-13900k.jpg",
    "modelUrl": "/models/i9-13900k.glb",
    "stockQuantity": 25
  }'
```

**Success Response** (201):
```json
{
  "id": 2,
  "name": "Intel Core i9-13900K",
  "slug": "intel-core-i9-13900k-1705314600000",
  "description": "13th generation Intel processor",
  "price": "589.99",
  "image_url": "/products/i9-13900k.jpg",
  "stock_quantity": 25,
  "model_3d_url": "/models/i9-13900k.glb",
  "brand": { "id": 1, "name": "Intel" },
  "category": { "id": 1, "name": "CPU" }
}
```

**Error Responses**:
- `401 Unauthorized` - No valid session
- `403 Forbidden` - User is not admin
- `400 Bad Request` - Missing required fields or invalid data
- `500 Internal Server Error` - Database error

---

### Order Endpoints (Admin)

#### Get All Orders (Admin)

**Retrieve all orders in the system**

- **HTTP Method**: `GET`
- **Path**: `/api/orders`
- **Authentication**: Required (no specific role check in implementation)
- **Query Parameters**: None

**Example Request**:
```bash
curl -X GET http://localhost:3000/api/orders
```

**Success Response** (200):
```json
[
  {
    "id": 1,
    "user": {
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "country": "USA"
    },
    "status": "pending",
    "order_time": "2024-01-15T10:30:00Z",
    "products": [
      {
        "product_id": 1,
        "product_name": "AMD Ryzen 5 5600X",
        "quantity": 2,
        "price": "299.99"
      }
    ]
  }
]
```

**Error Response**:
- `500 Internal Server Error` - Database error

---

### Order Endpoints (User)

#### Get User Orders

**Retrieve orders placed by the current user**

- **HTTP Method**: `GET`
- **Path**: `/api/user/orders`
- **Authentication**: Required
- **Query Parameters**: None

**Example Request**:
```bash
curl -X GET http://localhost:3000/api/user/orders \
  -H "Cookie: session-cookie=..."
```

**Success Response** (200):
```json
{
  "orders": [
    {
      "id": 1,
      "orderNumber": "ORD-00001",
      "date": "January 15, 2024",
      "status": "pending",
      "total": "599.98",
      "products": [
        {
          "id": 1,
          "name": "AMD Ryzen 5 5600X",
          "quantity": 2,
          "price": 299.99,
          "imageUrl": "/products/ryzen-5.jpg"
        }
      ],
      "orderTime": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Error Responses**:
- `401 Unauthorized` - No valid session
- `500 Internal Server Error` - Database error

---

#### Get Order Details

**Retrieve specific order information**

- **HTTP Method**: `GET`
- **Path**: `/api/user/orders/{orderId}`
- **Authentication**: Required
- **Path Parameters**:
  - `orderId` (integer): Order ID

**Example Request**:
```bash
curl -X GET http://localhost:3000/api/user/orders/1
```

**Success Response** (200):
```json
{
  "id": 1,
  "orderNumber": "ORD-00001",
  "date": "January 15, 2024",
  "status": "pending",
  "total": "599.98",
  "products": [
    {
      "id": 1,
      "name": "AMD Ryzen 5 5600X",
      "quantity": 2,
      "price": 299.99,
      "imageUrl": "/products/ryzen-5.jpg"
    }
  ]
}
```

**Error Responses**:
- `401 Unauthorized` - No valid session
- `400 Bad Request` - Invalid order ID
- `403 Forbidden` - Order does not belong to user
- `404 Not Found` - Order not found
- `500 Internal Server Error` - Database error

---

#### Checkout (From Cart)

**Create order from current user's cart**

- **HTTP Method**: `POST`
- **Path**: `/api/user/orders/checkout`
- **Authentication**: Required
- **Body Parameters**: None (uses cart contents)

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/user/orders/checkout
```

**Success Response** (200):
```json
{
  "orderId": 1,
  "success": true
}
```

**Error Responses**:
- `401 Unauthorized` - No valid session
- `400 Bad Request` - Cart is empty or insufficient stock
- `500 Internal Server Error` - Database error

---

#### Buy Now

**Create immediate order without cart**

- **HTTP Method**: `POST`
- **Path**: `/api/user/orders/buy-now`
- **Authentication**: Required
- **Body Parameters**:
  - `productId` (integer, required): Product ID to purchase
  - `quantity` (integer, optional): Quantity (default: 1)

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/user/orders/buy-now \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "quantity": 1
  }'
```

**Success Response** (200):
```json
{
  "orderId": 2,
  "success": true
}
```

**Error Responses**:
- `401 Unauthorized` - No valid session
- `400 Bad Request` - Invalid product ID, quantity, or insufficient stock
- `404 Not Found` - Product not found
- `500 Internal Server Error` - Database error

---

### Cart Endpoints

#### Get Cart

**Retrieve current user's shopping cart**

- **HTTP Method**: `GET`
- **Path**: `/api/user/cart`
- **Authentication**: Required
- **Query Parameters**: None

**Example Request**:
```bash
curl -X GET http://localhost:3000/api/user/cart
```

**Success Response** (200):
```json
{
  "cartItems": [
    {
      "id": 1,
      "slug": "amd-ryzen-5-5600x-1705314600000",
      "productName": "AMD Ryzen 5 5600X",
      "brandName": "AMD",
      "image": "/products/ryzen-5.jpg",
      "quantity": 2,
      "pricePerUnit": 299.99,
      "cost": "599.98"
    }
  ]
}
```

**Error Responses**:
- `401 Unauthorized` - No valid session
- `500 Internal Server Error` - Database error

---

#### Add to Cart

**Add a product to user's cart**

- **HTTP Method**: `POST`
- **Path**: `/api/user/cart/add`
- **Authentication**: Required
- **Body Parameters**:
  - `productId` (integer, required): Product ID to add
  - `quantity` (integer, optional): Quantity to add (default: 1)

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/user/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "quantity": 2
  }'
```

**Success Response** (200):
```json
{ "success": true }
```

**Error Responses**:
- `401 Unauthorized` - No valid session
- `400 Bad Request` - Product ID is required or invalid
- `404 Not Found` - Product not found
- `500 Internal Server Error` - Database error

---

#### Update Cart Item Quantity

**Modify quantity of item in cart (or remove if quantity = 0)**

- **HTTP Method**: `PUT`
- **Path**: `/api/user/cart/items/{productId}`
- **Authentication**: Required
- **Path Parameters**:
  - `productId` (integer): Product ID in cart
- **Body Parameters**:
  - `quantity` (integer, required): New quantity (0 to remove)

**Example Request**:
```bash
curl -X PUT http://localhost:3000/api/user/cart/items/1 \
  -H "Content-Type: application/json" \
  -d '{"quantity": 3}'
```

**Success Response** (200):
```json
{ "success": true }
```

**Error Responses**:
- `401 Unauthorized` - No valid session
- `400 Bad Request` - Invalid product ID or quantity
- `404 Not Found` - Cart not found
- `500 Internal Server Error` - Database error

---

#### Remove from Cart

**Remove item from cart**

- **HTTP Method**: `DELETE`
- **Path**: `/api/user/cart/items/{productId}`
- **Authentication**: Required
- **Path Parameters**:
  - `productId` (integer): Product ID to remove

**Example Request**:
```bash
curl -X DELETE http://localhost:3000/api/user/cart/items/1
```

**Success Response** (200):
```json
{
  "success": true,
  "cartCount": 0
}
```

**Error Responses**:
- `401 Unauthorized` - No valid session
- `400 Bad Request` - Invalid product ID
- `404 Not Found` - Cart not found
- `500 Internal Server Error` - Database error

---

### User Profile Endpoints

#### Update Profile

**Update user profile information**

- **HTTP Method**: `PUT`
- **Path**: `/api/user/profile`
- **Authentication**: Required
- **Body Parameters**:
  - `firstName` (string, required): User's first name
  - `lastName` (string, required): User's last name
  - `address` (string, required): Street address
  - `city` (string, required): City
  - `state` (string, required): State/Province
  - `country` (string, required): Country
  - `currentPassword` (string, optional): Required if changing password
  - `newPassword` (string, optional): Required if changing password

**Example Request**:
```bash
curl -X PUT http://localhost:3000/api/user/profile \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "address": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "country": "USA"
  }'
```

**Success Response** (200):
```json
{ "success": true }
```

**Error Responses**:
- `401 Unauthorized` - No valid session
- `400 Bad Request` - Missing required fields
- `500 Internal Server Error` - Database error

---

#### Update Theme Preference

**Set user's preferred theme**

- **HTTP Method**: `PUT`
- **Path**: `/api/user/theme`
- **Authentication**: Required
- **Body Parameters**:
  - `preferredMode` (string, required): Theme preference ("light" or "dark")

**Example Request**:
```bash
curl -X PUT http://localhost:3000/api/user/theme \
  -H "Content-Type: application/json" \
  -d '{"preferredMode": "light"}'
```

**Success Response** (200):
```json
{
  "success": true,
  "preferredMode": "light"
}
```

**Error Responses**:
- `401 Unauthorized` - No valid session
- `400 Bad Request` - Invalid theme mode

---

## Security

### Input Validation

All API endpoints implement comprehensive input validation:

- **String Sanitisation**: HTML tags and scripts are stripped from user inputs (e.g., brand names, product descriptions)
- **Type Validation**: All numeric inputs are validated for correct type and range
- **Required Fields**: Missing required fields return `400 Bad Request`
- **Range Validation**: Prices must be non-negative; quantities must be positive integers

### Authentication

- Passwords are hashed using Argon2 before storage
- Session cookies are HTTP-only and secure by default in production
- Session tokens are validated on every protected request
- Password changes are validated against current password

### Authorisation

The API implements role-based access control:

- **Public Endpoints**: Brand and product listing available without authentication
- **User/Customer Endpoints**: Cart, orders, and profile operations require valid session
- **Admin Endpoints**: Brand management and product creation require admin role

### Environment Variables

Sensitive configuration must be managed through environment variables:

```env
DATABASE_URL=postgresql://user:password@host:port/dbname
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=https://your-domain.com
```

---

## Response Formats

### Success Response

All successful responses return appropriate HTTP status codes:

- `200 OK` - Successful GET, PUT, or POST (update)
- `201 Created` - Successful POST (creation)

**Body Structure**:
```json
{
  "data": {},
  // OR individual resource objects
  // OR arrays of resources
}
```

### Error Response

All errors return JSON with error message:

```json
{
  "error": "Description of the error"
}
```

**Common HTTP Status Codes**:
- `400 Bad Request` - Invalid input or missing required fields
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Authenticated but insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists or constraint violation
- `500 Internal Server Error` - Server error

---

## Common Use Cases

### Complete Shopping Flow

```bash
# 1. Sign up or sign in
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# 2. Browse products
curl -X GET "http://localhost:3000/api/products?category=CPU"

# 3. Get specific product
curl -X GET http://localhost:3000/api/products/by-slug/product-name-slug

# 4. Add to cart
curl -X POST http://localhost:3000/api/user/cart/add \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 1}'

# 5. View cart
curl -X GET http://localhost:3000/api/user/cart

# 6. Checkout
curl -X POST http://localhost:3000/api/user/orders/checkout

# 7. View orders
curl -X GET http://localhost:3000/api/user/orders
```

### Admin Product Management

```bash
# 1. Authenticate as admin
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password"}'

# 2. Create brand
curl -X POST http://localhost:3000/api/brands \
  -H "Content-Type: application/json" \
  -d '{"name": "New Brand", "logoUrl": "/brands/logo.png"}'

# 3. Create product
curl -X POST http://localhost:3000/api/products/admin \
  -H "Content-Type: application/json" \
  -d '{
    "brandName": "New Brand",
    "productName": "Product Name",
    "category": "CPU",
    "price": 299.99,
    "stockQuantity": 50
  }'

# 4. View all orders
curl -X GET http://localhost:3000/api/orders
```

---

## Changelog

### Version 1.0.0

- Initial API release
- Authentication (sign up, sign in, sign out)
- Product browsing and search
- Shopping cart management
- Order processing
- User profile management
- Admin endpoints for brand and product management
