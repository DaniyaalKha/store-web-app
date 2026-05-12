import { PrismaClient, CategoryName, UserRole, OrderStatus, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

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
        logo_url: "images/brands/logos/amd.png",
      },
    }),

    prisma.brand.create({
      data: {
        name: "Intel",
        logo_url: "images/brands/logos/intel.png",
      },
    }),

    prisma.brand.create({
      data: {
        name: "NVIDIA",
        logo_url: "images/brands/logos/nvidia.png",
      },
    }),

    prisma.brand.create({
      data: {
        name: "MSI",
        logo_url: "images/brands/logos/msi.png",
      },
    }),

    prisma.brand.create({
      data: {
        name: "Corsair",
        logo_url: "images/brands/logos/corsair.png",
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
      description:
        "8-core gaming CPU with excellent gaming performance.",
      brand_id: brandMap["AMD"]!,
      category_id: categoryMap[CategoryName.CPU]!,
      stock_quantity: 20,
      price: "649.0",
      image_url: "images/products/7800x3d.jpg",
    },

    {
      name: "Ryzen 9 9950X",
      description:
        "16-core enthusiast processor for gaming and productivity.",
      brand_id: brandMap["AMD"]!,
      category_id: categoryMap[CategoryName.CPU]!,
      stock_quantity: 12,
      price: "1199.0",
      image_url: "images/products/9950x.jpg",
    },

    {
      name: "Intel Core i9-14900K",
      description:
        "Flagship Intel processor for high-end gaming and workloads.",
      brand_id: brandMap["Intel"]!,
      category_id: categoryMap[CategoryName.CPU]!,
      stock_quantity: 15,
      price: "899.0",
      image_url: "images/products/14900k.jpg",
    },

    // Products: GPUs
    {
      name: "RTX 5090",
      description:
        "Ultra high-end graphics card for 4K and AI workloads.",
      brand_id: brandMap["NVIDIA"]!,
      category_id: categoryMap[CategoryName.GPU]!,
      stock_quantity: 6,
      price: "3999.0",
      image_url: "images/products/rtx5090.jpg",
    },

    {
      name: "RTX 5080 SUPER",
      description:
        "High-end gaming GPU for 4K ultra gaming.",
      brand_id: brandMap["NVIDIA"]!,
      category_id: categoryMap[CategoryName.GPU]!,
      stock_quantity: 10,
      price: "2199.0",
      image_url: "images/products/rtx5080super.jpg",
    },

    {
      name: "RTX 5070 Ti",
      description:
        "Mid-to-high range GPU ideal for 1440p gaming.",
      brand_id: brandMap["NVIDIA"]!,
      category_id: categoryMap[CategoryName.GPU]!,
      stock_quantity: 18,
      price: "1399.0",
      image_url: "images/products/rtx5070ti.jpg",
    },

    {
      name: "RX 7600",
      description:
        "Entry-level AMD GPU great for 1080p gaming and budget builds.",
      brand_id: brandMap["AMD"]!,
      category_id: categoryMap[CategoryName.GPU]!,
      stock_quantity: 25,
      price: "449.0",
      image_url: "images/products/rx7600.jpg",
    },

    {
      name: "RX 7900 XTX",
      description:
        "High-end AMD GPU designed for 4K gaming and demanding workloads.",
      brand_id: brandMap["AMD"]!,
      category_id: categoryMap[CategoryName.GPU]!,
      stock_quantity: 10,
      price: "1799.0",
      image_url: "images/products/rx7900xtx.jpg",
    },

    // Products: RAM
    {
      name: "Corsair Vengeance DDR5 32GB 6000MHz",
      description:
        "High-speed DDR5 memory kit for gaming systems.",
      brand_id: brandMap["Corsair"]!,
      category_id: categoryMap[CategoryName.RAM]!,
      stock_quantity: 25,
      price: "219.0",
      image_url: "images/products/vengeance32.jpg",
    },
  ];

  await prisma.product.createMany({
    data: products,
  });

  // users
  const admin = await prisma.user.create({
    data: {
      email: "admin@test.com",
      first_name: "Admin",
      last_name: "User",
      password_hash: "hashed_admin_password",
      role: UserRole.admin,
      address: "1 Admin Street",
      city: "Sydney",
      state: "NSW",
      country: "Australia",
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      email: "john@test.com",
      first_name: "John",
      last_name: "Doe",
      password_hash: "hashed_password_1",
      role: UserRole.customer,
      address: "123 Placeholder St",
      city: "Sydney",
      state: "NSW",
      country: "Australia",
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: "jane@test.com",
      first_name: "Jane",
      last_name: "Smith",
      password_hash: "hashed_password_2",
      role: UserRole.customer,
      address: "321 Example Ave",
      city: "Melbourne",
      state: "VIC",
      country: "Australia",
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
        product_id: allProducts[10]!.id,
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
        product_id: allProducts[8]!.id,
        quantity: 2,
      },

      {
        order_id: order2.id,
        product_id: allProducts[3]!.id,
        quantity: 1,
      },

      {
        order_id: order2.id,
        product_id: allProducts[10]!.id,
        quantity: 1,
      },

      {
        order_id: order3.id,
        product_id: allProducts[18]!.id,
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