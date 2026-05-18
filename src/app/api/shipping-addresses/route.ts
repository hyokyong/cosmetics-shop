import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth";
import type { ShippingAddressCreateRequest } from "@/types/index";

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorized();

    const addresses = await prisma.shippingAddress.findMany({
      where: { userId: user.userId },
    });
    return NextResponse.json(addresses);
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorized();

    const { address, detailAddress, zipCode } =
      (await req.json()) as ShippingAddressCreateRequest;

    const created = await prisma.shippingAddress.create({
      data: { userId: user.userId, address, detailAddress, zipCode },
    });

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
