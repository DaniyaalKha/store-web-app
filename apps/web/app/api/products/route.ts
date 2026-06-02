import { NextRequest, NextResponse } from "next/server";
import { prisma, CategoryName, Prisma } from "@repo/database";

// map UI categories to database CategoryName values
const categoryMapping: Record<string, CategoryName> = {
  CPU: CategoryName.CPU,
  Graphics: CategoryName.GPU,
  Memory: CategoryName.RAM,
  Storage: CategoryName.storage,
  Motherboards: CategoryName.motherboard,
  Power: CategoryName.PSU,
  Cooling: CategoryName.fan,
  Cases: CategoryName.case,
  Accessories: CategoryName.mouse, // handled differently to combine keyboards, monitors, cables
};

const accessoryCategories: CategoryName[] = [
  CategoryName.mouse,
  CategoryName.cable,
  CategoryName.keyboard,
  CategoryName.monitor,
];

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { brand: true; category: true };
}>;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    // Fetch all products with relations
    let products: ProductWithRelations[] = await prisma.product.findMany({
      include: {
        brand: true,
        category: true,
      },
    });

    // Apply category filter
    if (category) {
      if (category === "Accessories") {
        products = products.filter((p: ProductWithRelations) => accessoryCategories.includes(p.category.name));
      } else {
        const dbCategory = categoryMapping[category];
        if (dbCategory) {
          products = products.filter((p: ProductWithRelations) => p.category.name === dbCategory);
        }
      }
    }

    // apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter((p: ProductWithRelations) =>
        p.name.toLowerCase().includes(searchLower) ||
        (p.description && p.description.toLowerCase().includes(searchLower)) ||
        p.brand.name.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
