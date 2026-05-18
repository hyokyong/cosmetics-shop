import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorized();

    const { id } = await params;
    const address = await prisma.shippingAddress.findFirst({
      where: { id: Number(id), userId: user.userId },
    });

    if (!address) {
      return NextResponse.json(
        { message: "배송지를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    await prisma.shippingAddress.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "삭제 완료" });
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
