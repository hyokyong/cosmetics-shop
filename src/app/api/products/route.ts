import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, forbidden } from "@/lib/auth";
import { MOCK_PRODUCTS } from "@/lib/mockData";

// GET /api/products - 상품 목록
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
    const size = Math.max(Number(searchParams.get("size") ?? 10), 1);
    const category = searchParams.get("category");
    const brandName = searchParams.get("brandName");

    const where = {
      isDeleted: false,
      ...(category && { category }),
      ...(brandName && { brandName }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    if (total === 0) {
      const fallback = MOCK_PRODUCTS.filter(
        (product) =>
          (!category || product.category === category) &&
          (!brandName || product.brandName === brandName),
      );

      return NextResponse.json({
        content: fallback.slice((page - 1) * size, (page - 1) * size + size),
        total: fallback.length,
        page,
        size,
      });
    }

    return NextResponse.json({ content: products, total, page, size });
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}

// POST /api/products - 상품 등록 (관리자만)
export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorized();
    if (user.role !== "ADMIN") return forbidden();

    const { name, description, price, stock, category, brandName, imageUrl } =
      await req.json();

    const product = await prisma.product.create({
      data: { name, description, price, stock, category, brandName, imageUrl },
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
