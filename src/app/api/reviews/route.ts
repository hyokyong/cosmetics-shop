import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = Number(searchParams.get("productId"));
    if (!productId) {
      return NextResponse.json({ message: "productId가 필요합니다." }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      reviews.map((r) => ({
        id: r.id,
        userId: r.userId,
        productId: r.productId,
        content: r.content,
        rating: r.rating,
        createdAt: r.createdAt,
        userName: r.user.name,
      }))
    );
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser) return unauthorized();

    const { productId, content, rating } = await req.json();

    if (!productId || !content || !rating) {
      return NextResponse.json({ message: "필수 항목이 누락됐습니다." }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ message: "평점은 1~5 사이여야 합니다." }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: { userId: authUser.userId, productId, content, rating },
      include: { user: { select: { name: true } } },
    });

    return NextResponse.json(
      {
        id: review.id,
        userId: review.userId,
        productId: review.productId,
        content: review.content,
        rating: review.rating,
        createdAt: review.createdAt,
        userName: review.user.name,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
