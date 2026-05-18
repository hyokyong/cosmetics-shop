import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, forbidden } from "@/lib/auth";
import type { PartnerCreateRequest } from "@/types/index";

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorized();
    if (user.role !== "ADMIN") return forbidden();

    const partners = await prisma.partner.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(partners);
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorized();
    if (user.role !== "ADMIN") return forbidden();

    const { email, brandName, businessNumber } =
      (await req.json()) as PartnerCreateRequest;

    const partner = await prisma.partner.create({
      data: { email, brandName, businessNumber },
    });

    return NextResponse.json(partner, { status: 201 });
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
