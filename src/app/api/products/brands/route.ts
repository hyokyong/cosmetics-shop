import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MOCK_PRODUCTS } from "@/lib/mockData";

// GET /api/products/brands - 브랜드 목록
export async function GET() {
  try {
    const brands = await prisma.product.findMany({
      where: { isDeleted: false },
      select: { brandName: true },
      distinct: ["brandName"],
    });

    if (brands.length === 0) {
      return NextResponse.json(
        Array.from(new Set(MOCK_PRODUCTS.map((b) => b.brandName))),
      );
    }

    return NextResponse.json(brands.map((b) => b.brandName));
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
