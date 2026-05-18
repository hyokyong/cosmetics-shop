import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, forbidden } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorized();
    if (user.role !== "ADMIN") return forbidden();

    const { id } = await params;
    const { isActive } = await req.json();

    const partner = await prisma.partner.findUnique({
      where: { id: Number(id) },
    });

    if (!partner) {
      return NextResponse.json(
        { message: "파트너를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const updated = await prisma.partner.update({
      where: { id: Number(id) },
      data: { isActive },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
