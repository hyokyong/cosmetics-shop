import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, forbidden } from "@/lib/auth";
import { MOCK_PRODUCTS } from "@/lib/mockData";

// GET /api/products/:id - 상품 상세
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findFirst({
      where: { id: Number(id), isDeleted: false },
    });
    if (!product) {
      const mock = MOCK_PRODUCTS.find((item) => item.id === Number(id));
      if (mock) return NextResponse.json(mock);
      return NextResponse.json(
        { message: "상품이 없습니다." },
        { status: 404 },
      );
    }
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}

// PUT /api/products/:id - 상품 수정 (관리자만)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorized();
    if (user.role !== "ADMIN") return forbidden();

    const { id } = await params;
    const data = await req.json();

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}

// DELETE /api/products/:id - 상품 삭제 (소프트, 관리자만)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorized();
    if (user.role !== "ADMIN") return forbidden();

    const { id } = await params;
    await prisma.product.update({
      where: { id: Number(id) },
      data: { isDeleted: true },
    });
    return NextResponse.json({ message: "삭제 완료" });
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
