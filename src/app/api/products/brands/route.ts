import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const brands = await prisma.product.findMany({
      where: { isVisible: true },
      select: { brandName: true },
      distinct: ["brandName"],
    });

    return NextResponse.json(
      brands.map((b: { brandName: string }) => b.brandName),
    );
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
