import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, forbidden } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
    const size = Math.max(Number(searchParams.get("size") ?? 10), 1);
    const category = searchParams.get("category");
    const brandName = searchParams.get("brandName");

    const where = {
      isVisible: true,
      ...(category && { category }),
      ...(brandName && { brandName }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { options: true },
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ content: products, total, page, size });
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorized();
    if (user.role !== "ADMIN") return forbidden();

    const { name, description, basePrice, stock, category, brandName, imageUrl, isVisible, options } =
      await req.json();

    const product = await prisma.product.create({
      data: {
        name,
        description,
        basePrice,
        stock: stock ?? 0,
        category,
        brandName,
        imageUrl,
        isVisible: isVisible ?? true,
        ...(options?.length > 0 && {
          options: {
            create: options.map((opt: any) => ({
              color: opt.color,
              size: opt.size,
              additionalPrice: opt.additionalPrice ?? 0,
              quantity: opt.quantity ?? 0,
            })),
          },
        }),
      },
      include: { options: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
