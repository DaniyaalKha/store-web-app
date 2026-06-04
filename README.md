# store-web-app
A modern B2C e-commerce web application built for a university assignment using a monorepository architecture with NextJS and React.

## Overview
The application simulates a business-to-consumer online store where users can:
- browse products
- order products
- checkout (mocked payment)

Additionally, admins can:
- add, edit, and remove products
- view purchase records.

## Tech Stack
Written in TypeScript.

**Frontend**
- React
- Tailwind CSS
- ThreeJS

**Backend**
- NextJS
- Prisma with PostgreSQL
- BetterAuth (and Argon2)

## Getting Started
**Prerequisites**
- NodeJS 18 or higher
- pnpm or equivalent
- Git
- PostgreSQL  

**Installation**
1. Clone the repository.
```bash
git clone https://github.com/DaniyaalKha/store-web-app.git
```

2. Navigate into the project.
```bash
cd store-web-app
```

3. Install dependencies.
```bash
pnpm install
```

4. Create environment variable (.env) file at the root of the project.  
*(Replace "your-password" with your PostgreSQL password).*
```env
DATABASE_URL="postgresql://postgres:your-password@localhost:5432/pc_store_db"
BETTER_AUTH_SECRET="this-should-be-replaced-with-a-better-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
```

5. Setup the database.  
*Navigate to PSQL and create the database*
```bash
CREATE DATABASE pc_store_db;
```

*Generate and seed the database* 
```bash
pnpm db:setup
```
  
6. Run the project.  
*Note: this project uses Turborepo and runs on port 3000.*
```bash
pnpm dev
```

**Testing**  
All accounts have the password "Testing123".
- user accounts: john@test.com jane@test.com 
- admin accounts: admin@test.com  

To run Playwright tests, run this from the root:
```bash
pnpm test
```

**Deployment**  
This application is deployed on Vercel available here: https://store-web-app-umber.vercel.app/.

## Future Improvements
- Full payment system (PayPal, Stripe)
- Additional tests
- Rate limiting
- File upload for admins (for product and brand images and product 3D models)
- Remove placeholder assets from public folder

## Assignment Context
This project was developed as part of a university assignment for COMP3036 at Western Sydney University to demonstrate:
- full-stack web application development
- modern frontend frameworks
- software architecture principles
- version control and collaboration workflows
- scalable monorepo project structure

## Attributions
- [Luis Gonzalez / luchox23 on Unsplash for computer photo](https://unsplash.com/photos/black-and-gray-computer-keyboard-jgzdwJWCPDI)
- [Arham Abdullah on SketchFab for RTX 3080TI graphics card model](https://sketchfab.com/3d-models/rtx-3080ti-graphics-card-3d-model-7c90da836c4a43ee99afbe0c0f39cf12)  
- [PolyDavid on SketchFab for AMD Ryzen 5 9600x CPU model](https://sketchfab.com/3d-models/amd-9600x-cpu-low-poly-b433826fb4b1432dbc18a90b89dede71) 
- [Spark Games on SketchFab for RAM model](https://sketchfab.com/3d-models/old-computer-ram-9d3016df1c44484096c589b75a53936e)
- Product images from relevant brands and retailers.