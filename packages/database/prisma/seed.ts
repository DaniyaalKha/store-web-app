import { config as loadEnv } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient, CategoryName, UserRole, OrderStatus, Prisma } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { hashPassword } from "../../../apps/web/lib/hashing.ts";

const seedDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(seedDir, "..", "..", "..");
const rootEnvPath = resolve(rootDir, ".env");
loadEnv({ path: rootEnvPath });

let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in the .env file at the root.");
}

// resolve relative path from root directory
if (databaseUrl.startsWith("file:./")) {
  const relativePath = databaseUrl.replace("file:", "");
  const absolutePath = resolve(rootDir, relativePath);
  databaseUrl = `file:${absolutePath}`;
}

const adapter = new PrismaLibSql({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

// utility function to generate kebab-case slug from product name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove special characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-') // Rrplace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // remove leading/trailing hyphens
}

async function main() {
  console.log("Seeding database...");

  // delete child tables
  await prisma.cartItem.deleteMany();
  await prisma.orderProduct.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cart.deleteMany();

  // delete parent tables
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // categories
  await prisma.category.createMany({
    data: [
      { name: CategoryName.CPU },
      { name: CategoryName.GPU },
      { name: CategoryName.RAM },
    ],
  });

  const categories = await prisma.category.findMany();

  const categoryMap = Object.fromEntries(
    categories.map((c) => [c.name, c.id])
  );

  // brands
   const brands = await Promise.all([
    prisma.brand.create({
      data: {
        name: "AMD",
        logo_url: "/brands/AMD.png",
      },
    }),

    prisma.brand.create({
      data: {
        name: "Intel",
        logo_url: "/brands/Intel.png",
      },
    }),

    prisma.brand.create({
      data: {
        name: "NVIDIA",
        logo_url: "/brands/Nvidia.png",
      },
    }),

    prisma.brand.create({
      data: {
        name: "MSI",
        logo_url: "/brands/MSI.png",
      },
    }),

    prisma.brand.create({
      data: {
        name: "Corsair",
        logo_url: "/brands/Corsair.png",
      },
    }),

    prisma.brand.create({
      data: {
        name: "Gigabyte",
        logo_url: "/brands/Gigabyte.png",
      },
    }),
  ]);

  const brandMap = Object.fromEntries(
    brands.map((b) => [b.name, b.id])
  );

  // products
    const products: Prisma.ProductCreateManyInput[] = [
    // Products: CPUs
    {
      name: "Ryzen 7 7800X3D",
      slug: generateSlug("Ryzen 7 7800X3D"),
      description:
        "Features 8 cores, 16 threads, and a massive 96MB of L3 cache via AMD's 3D V-Cache technology.",
      brand_id: brandMap["AMD"]!,
      category_id: categoryMap[CategoryName.CPU]!,
      stock_quantity: 20,
      price: "649.0",
      image_url: "/products/images/AMD_Ryzen_7.png",
      model_3d_url: "/products/models/RTX_3080.glb",
    },

    {
      name: "Ryzen 9 9950X",
      slug: generateSlug("Ryzen 9 9950X"),
      description:
        "AMD's flagship 16-core, 32-thread desktop processor built on the Zen 5 architecture.",
      brand_id: brandMap["AMD"]!,
      category_id: categoryMap[CategoryName.CPU]!,
      stock_quantity: 12,
      price: "1199.0",
      image_url: "/products/images/AMD_Ryzen_9.png",
      model_3d_url: "/products/models/RTX_3080.glb",
    },

    {
      name: "Core i9-14900K",
      slug: generateSlug("Core i9-14900K"),
      description:
        "Intel's flagship 24-core desktop processor featuring blazing clock speeds up to 6.0 GHz.",
      brand_id: brandMap["Intel"]!,
      category_id: categoryMap[CategoryName.CPU]!,
      stock_quantity: 15,
      price: "899.0",
      image_url: "/products/images/Intel_i9.png",
      model_3d_url: "/products/models/RTX_3080.glb",
    },

    // Products: GPUs
    {
      name: "RTX 5090 (32GB)",
      slug: generateSlug("RTX 5090 (32GB)"),
      description:
        "Ultra high-end NVIDIA GPU for 4K and AI workloads.",
      brand_id: brandMap["MSI"]!,
      category_id: categoryMap[CategoryName.GPU]!,
      stock_quantity: 6,
      price: "6199.0",
      image_url: "/products/images/MSI_RTX_5090.png",
      model_3d_url: "/products/models/RTX_3080.glb",
    },

    {
      name: "RTX 5080 (16GB)",
      slug: generateSlug("RTX 5080 (16GB)"),
      description:
        "High-end gaming NVIDIA GPU for 4K ultra gaming.",
      brand_id: brandMap["MSI"]!,
      category_id: categoryMap[CategoryName.GPU]!,
      stock_quantity: 10,
      price: "2199.0",
      image_url: "/products/images/MSI_RTX_5080.png",
      model_3d_url: "/products/models/RTX_3080.glb",
    },

    {
      name: "RTX 5070 (12GB)",
      slug: generateSlug("RTX 5070 (12GB)"),
      description:
        "Mid-range NVIDIA GPU ideal for 1440p gaming.",
      brand_id: brandMap["Gigabyte"]!,
      category_id: categoryMap[CategoryName.GPU]!,
      stock_quantity: 18,
      price: "999.0",
      image_url: "/products/images/Gigabyte_RTX_5070.png",
      model_3d_url: "/products/models/RTX_3080.glb",
    },

    {
      name: "Radeon RX 7600 (8GB)",
      slug: generateSlug("Radeon RX 7600 (8GB)"),
      description:
        "Entry-level AMD GPU great for 1080p gaming and budget builds.",
      brand_id: brandMap["AMD"]!,
      category_id: categoryMap[CategoryName.GPU]!,
      stock_quantity: 25,
      price: "399.0",
      image_url: "/products/images/AMD_Radeon_RX_7600.png",
      model_3d_url: "/products/models/RTX_3080.glb",
    },

    // Products: RAM
    {
      name: "Vengeance DDR5 32GB 6000MHz",
      slug: generateSlug("Vengeance DDR5 32GB 6000MHz"),
      description:
        "High-speed DDR5 memory.",
      brand_id: brandMap["Corsair"]!,
      category_id: categoryMap[CategoryName.RAM]!,
      stock_quantity: 25,
      price: "219.0",
      image_url: "/products/images/Corsair_Vengeance_RAM.png",
      model_3d_url: "/products/models/RTX_3080.glb",
    },
  ];

  await prisma.product.createMany({
    data: products,
  });

  // users
  const hashedPassword = await hashPassword("Testing123");

  const admin = await prisma.user.create({
  data: {
    name: "Admin User",
    email: "admin@test.com",
    emailVerified: true,

    firstName: "Admin",
    lastName: "User",

    role: UserRole.admin,

    address: "1 Admin Street",
    city: "Sydney",
    state: "NSW",
    country: "Australia",
  },
});

  await prisma.account.create({
    data: {
      userId: admin.id,
      providerId: "credential",
      accountId: admin.email,
      password: hashedPassword,
    },
  });

const customer1 = await prisma.user.create({
  data: {
    name: "John Doe",
    email: "john@test.com",
    emailVerified: true,

    firstName: "John",
    lastName: "Doe",

    role: UserRole.customer,

    address: "123 Placeholder St",
    city: "Sydney",
    state: "NSW",
    country: "Australia",
  },
});

  await prisma.account.create({
    data: {
      userId: customer1.id,
      providerId: "credential",
      accountId: customer1.email,
      password: hashedPassword,
    },
  });

const customer2 = await prisma.user.create({
  data: {
    name: "Jane Smith",
    email: "jane@test.com",
    emailVerified: true,

    firstName: "Jane",
    lastName: "Smith",

    role: UserRole.customer,

    address: "321 Example Ave",
    city: "Melbourne",
    state: "VIC",
    country: "Australia",
  },
});

  await prisma.account.create({
    data: {
      userId: customer2.id,
      providerId: "credential",
      accountId: customer2.email,
      password: hashedPassword,
    },
  });

  // carts
  const cart1 = await prisma.cart.create({
    data: {
      user_id: customer1.id,
    },
  });

  const cart2 = await prisma.cart.create({
    data: {
      user_id: customer2.id,
    },
  });

  const allProducts = await prisma.product.findMany();

  await prisma.cartItem.createMany({
    data: [
      {
        cart_id: cart1.id,
        product_id: allProducts[0]!.id,
        quantity: 1,
      },

      {
        cart_id: cart1.id,
        product_id: allProducts[3]!.id,
        quantity: 1,
      },

      {
        cart_id: cart2.id,
        product_id: allProducts[6]!.id,
        quantity: 2,
      },
    ],
  });

  // orders
  const order1 = await prisma.order.create({
    data: {
      user_id: customer1.id,
      status: OrderStatus.delivered,
    },
  });

  const order2 = await prisma.order.create({
    data: {
      user_id: customer2.id,
      status: OrderStatus.shipped,
    },
  });

  const order3 = await prisma.order.create({
    data: {
      user_id: customer1.id,
      status: OrderStatus.pending,
    },
  });

  await prisma.orderProduct.createMany({
    data: [
      {
        order_id: order1.id,
        product_id: allProducts[0]!.id,
        quantity: 1,
      },

      {
        order_id: order1.id,
        product_id: allProducts[5]!.id,
        quantity: 2,
      },

      {
        order_id: order2.id,
        product_id: allProducts[3]!.id,
        quantity: 1,
      },

      {
        order_id: order2.id,
        product_id: allProducts[6]!.id,
        quantity: 1,
      },

      {
        order_id: order3.id,
        product_id: allProducts[7]!.id,
        quantity: 1,
      },
    ],
  });

  console.log("Database successfully seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
