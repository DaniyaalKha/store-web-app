# Web Application Structure

## Project Overview
A full-stack e-commerce web application built with **Next.js 16.2.0**, **React 19.2.0**, **Better-Auth 1.6.11**, and **PostgreSQL**. Monorepo structure using **Turborepo** and **pnpm workspaces**.

---

## `/apps/web` - Next.js Web Application

### `/app` - Application Pages & Routes

#### Pages

| Page | Description |
|------|-------------|
| `page.tsx` | **Home/Shop Page** - Displays featured products, product listings with category filters, search functionality, and product grid with "Add to Cart" buttons |
| `login/page.tsx` | **Login Page** - Email and password login form with "Forgot Password" link, error handling, and redirect to home on success |
| `register/page.tsx` | **Registration Page** - Account creation form with email, password (strength indicator), first/last name, address fields, and auto-login after successful registration |
| `cart/page.tsx` | **Shopping Cart** - Displays cart items with quantities, prices, item removal, quantity adjustment, cart summary with subtotal/tax/total, and checkout button |
| `profile/page.tsx` | **User Profile** - Shows user account info (name, email), address, preferred shopping mode, password change form, and option to edit profile details |
| `admin/page.tsx` | **Admin Dashboard** - Admin-only page for managing products (create/edit/delete), managing orders, managing brands, and viewing sales analytics |
| `product/page.tsx` | **Product Detail Page** - Individual product view with images, description, price, stock status, brand info, ratings/reviews, quantity selector, and add to cart button |
| `order-confirmation/page.tsx` | **Order Confirmation** - Displays successful order summary with order ID, items, total amount, shipping address, and estimated delivery date |

### `/components` - Reusable React Components

#### Authentication Components

- **`LoginForm/`** - Login form with email and password fields, remember-me checkbox, error messages, and submit button. Handles form validation, error handling, and calls authentication API to verify credentials.

- **`RegistrationForm/`** - Comprehensive registration form with email, password (with real-time strength indicator showing weak/fair/good/strong), first name, last name, and address fields. Displays password requirements checklist (uppercase, lowercase, number, special char, length). Calls signup API and auto-logs in user on success.

- **`AuthFormContainer/`** - Layout wrapper for authentication pages. Provides consistent styling, responsive grid layout with form on one side and cover image on the other. Handles mobile responsiveness (stacked on small screens).

- **`AuthCoverSection/`** - Background cover section displayed on auth pages with store branding/logo, tagline, marketing copy, and decorative background image. Creates visual hierarchy and brand presence.

- **`FormInput/`** - Reusable base form input component with label, error message display, validation feedback icons, and support for text/email/password input types. Provides consistent styling across all forms.

#### Product Components

- **`ProductCard/`** - Grid item component displaying individual product with image thumbnail, product name, price, brand name, star rating, and quick action buttons (add to cart, view details, add to wishlist). Shows stock availability status and sale badge if applicable.

- **`ProductActions/`** - Button group for product interactions including "Add to Cart", "Buy Now", and "Add to Wishlist" buttons with quantity selector. Manages button states based on stock availability.

- **`ProductCategories/`** - Sidebar filter component showing all available product categories with checkboxes for multi-category filtering. Displays category count and allows users to refine product listings.

- **`ProductFilters/`** - Advanced filtering panel with price range slider, brand filter with checkboxes, star rating filter, and in-stock toggle. Allows combination of multiple filters for refined product search.

#### Cart Components

- **`CartItem/`** - Individual cart item display with product thumbnail image, product name, price per unit, quantity adjuster (increment/decrement buttons), and remove button. Shows item subtotal (price × quantity). Handles real-time updates when quantity changes.

- **`CartSummaryItem/`** - Compact cart item display used in order summary and checkout pages. Shows product name, quantity, and line total. Simplified version without edit functionality.

- **`OrderSummary/`** - Summary section displaying cart totals including subtotal, tax calculation (based on location), shipping cost, and grand total. Includes prominent checkout button and option to continue shopping.

#### Admin Components

- **`ManageProducts/`** - Product management table/list showing all products with columns for product image thumbnail, name, price, stock quantity, and category. Includes buttons to create new product, edit existing product, and delete product. May include search/filter options.

- **`ManageProductRow/`** - Single product row in admin management table with product data and inline edit/delete action buttons. Shows stock level indicator with color coding (in-stock/low-stock/out-of-stock). Clickable to expand for detailed view.

- **`ManageOrders/`** - Orders management table showing all orders with columns for order ID, customer name, order total, order status (badge), and order date. Includes buttons to view order details and update order status.

- **`OrderListOrder/`** - Individual order row in admin table with payment status badge (colors for different statuses), summary of order items (product names and quantities), order total, and action buttons. Expandable for full order details.

- **`BrandEditModal/`** - Modal form for creating new brand or editing existing brand. Includes name text field, logo image upload field, description textarea, and submit/cancel buttons. Validates required fields before submission.

- **`BrandFilterModal/`** - Modal filter selector showing list of all brands with checkboxes for multi-select filtering. Includes "Apply" button to apply filter and "Clear All" to reset selection. Used to filter products by brand.

#### Layout Components

- **`Header/`** - Navigation header displayed at top of every page with store logo (clickable link to home), search bar for product search, category navigation menu, user profile dropdown menu (login/signup/profile/logout), and shopping cart icon with item count badge. Sticky on scroll. Responsive hamburger menu on mobile.

- **`Footer/`** - Footer displayed at bottom of every page with company information, links to pages (about, contact, policies), customer service section (contact info, FAQ), payment method icons (credit card, PayPal, etc.), and social media links (Facebook, Instagram, Twitter). Multi-column layout on desktop, stacked on mobile.

---

## `/apps/web/lib` - Utilities & Hooks

| File | Purpose |
|------|---------|
| `auth.ts` | Better-auth configuration with session settings, password hashing strategy, and authentication behavior |
| `auth-validation.ts` | Zod schemas for input validation (email format, password requirements, name patterns) |
| `auth-utils.ts` | Helper functions for authentication flows (signup, login, session management) |
| `use-auth.tsx` | React context hook providing authentication state, user info, and auth operations (signup, login, logout) |
| `use-cart.ts` | Cart state management hook for adding/removing items, updating quantities, calculating totals |
| `use-theme.tsx` | Theme management hook for toggling between light/dark mode |
| `hashing.ts` | Password hashing and verification utilities using Argon2 |
| `ensure-user.ts` | Server-side middleware to verify user is authenticated before accessing protected pages |
| `utils.ts` | General utility functions (formatting, calculations, helpers) |

---

## `/packages/database` - Database & Prisma

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | PostgreSQL database schema (User, Product, Order, Brand, Cart models) |
| `prisma/seed.ts` | Database seeding with test data |
| `prisma/migrations/` | Database migration history |
| `package.json` | Database package configuration |
| `prisma.config.ts` | Prisma client configuration |

---

## `/packages/ui` - Shared UI Library

| File | Purpose |
|------|---------|
| `src/button.tsx` | Reusable button component |
| `src/card.tsx` | Card layout component |
| `src/code.tsx` | Code display component |
| `lib/utils.ts` | UI utility functions (classname helpers) |

---


## `/tests` - Playwright E2E Tests

### Test Suites
| File | Coverage |
|------|----------|
| `e2e/authentication.spec.ts` | Registration, login, sessions, password changes, validation, rate limiting |
| `e2e/api-user.spec.ts` | User profile API endpoints |
| `e2e/api-products.spec.ts` | Product listing & detail endpoints |
| `e2e/api-orders.spec.ts` | Order creation & management |
| `e2e/api-cart.spec.ts` | Cart operations |
| `e2e/authorization.spec.ts` | Permission-based access control |
| `e2e/data-validation.spec.ts` | Input validation & sanitization |
| `e2e/security.spec.ts` | Security features (XSS, SQL injection, etc.) |
| `e2e/frontend.spec.ts` | UI component interactions |
| `e2e/misc-edge-cases.spec.ts` | Edge cases & error handling |

### Helpers
- `helpers/auth-helpers.ts` - Authentication test utilities
- `helpers/data-helpers.ts` - Data generation for tests
- `helpers/constants.ts` - Test user definitions & constants

### Configuration
- `playwright.config.ts` - Playwright test runner configuration
- `global-setup.ts` - Pre-test setup (database seed)
- `global-teardown.ts` - Post-test cleanup