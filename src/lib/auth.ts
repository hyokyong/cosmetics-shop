import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export type JwtPayload = {
  userId: number;
  role: string;
};

// 토큰에서 유저 정보 꺼내는 함수
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
}

// API Route에서 인증 체크하는 함수
export function getAuthUser(req: NextRequest): JwtPayload | null {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

    const token = authHeader.split(" ")[1];
    return verifyToken(token);
  } catch {
    return null;
  }
}

// 인증 필요한 API에서 쓰는 헬퍼
export function unauthorized() {
  return NextResponse.json(
    { message: "로그인이 필요합니다." },
    { status: 401 },
  );
}

// 관리자 권한 체크
export function forbidden() {
  return NextResponse.json({ message: "권한이 없습니다." }, { status: 403 });
}
