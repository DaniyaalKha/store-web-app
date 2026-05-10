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
- NextJS
- React
- TailwindCSS
- Shadcn/ui

**Backend**
- Prisma

## Getting Started
**Prerequisites**
- NodeJS 18 or higher
- pnpm or equivalent
- Git

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

4. Create environment variable (.env) files.
```env
(To be added)
```


6. Run the project. (Note: this project uses Turborepo to manage multiple applications.)
```bash
pnpm dev
```

**Deployment**  
This application is deployed on Vercel available here: (to be added).

## Assignment Context
This project was developed as part of a university assignment for COMP3036 at Western Sydney University to demonstrate:
- full-stack web application development
- modern frontend frameworks
- software architecture principles
- version control and collaboration workflows
- scalable monorepo project structure
Note: some features such as the database schema and payment system are simplified or mocked.