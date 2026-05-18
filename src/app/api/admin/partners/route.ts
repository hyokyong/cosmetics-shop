import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized, forbidden } from "@/lib/auth";
import { MOCK_PARTNERS } from "@/lib/mockData";
import type { PartnerCreateRequest } from "@/types/index";

const globalForMock = globalThis as unknown as {
  mockPartners?: { list: Partner[]; nextId: number };
};

const initMockPartners = () => {
  if (!globalForMock.mockPartners) {
    globalForMock.mockPartners = {
      list: [...MOCK_PARTNERS],
      nextId: MOCK_PARTNERS.length + 1,
    };
  }
  return globalForMock.mockPartners;
};

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorized();
    if (user.role !== "ADMIN") return forbidden();

    const store = initMockPartners();
    return NextResponse.json(store.list);
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorized();
    if (user.role !== "ADMIN") return forbidden();

    const { email, password, brandName, businessNumber } =
      (await req.json()) as PartnerCreateRequest;

    const store = initMockPartners();
    const created = {
      id: store.nextId,
      email,
      brandName,
      businessNumber,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    store.nextId += 1;
    store.list.push(created);

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
