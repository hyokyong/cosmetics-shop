import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, forbidden } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findFirst({
      where: { id: Number(id), isVisible: true },
      include: { options: true },
    });
    if (!product) {
      return NextResponse.json({ message: "상품이 없습니다." }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}

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
      include: { options: true },
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}

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
      data: { isVisible: false },
    });
    return NextResponse.json({ message: "삭제 완료" });
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
