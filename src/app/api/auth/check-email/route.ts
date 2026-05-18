import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "이메일이 필요합니다." },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    return NextResponse.json({ isDuplicate: Boolean(existing) });
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
