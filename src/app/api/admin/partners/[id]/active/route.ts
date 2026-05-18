import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized, forbidden } from "@/lib/auth";
import { MOCK_PARTNERS } from "@/lib/mockData";

const globalForMock = globalThis as unknown as {
  mockPartners?: { list: typeof MOCK_PARTNERS; nextId: number };
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
    const store = initMockPartners();
    const partner = store.list.find((item) => item.id === Number(id));

    if (!partner) {
      return NextResponse.json(
        { message: "파트너를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    partner.isActive = isActive;
    return NextResponse.json(partner);
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
