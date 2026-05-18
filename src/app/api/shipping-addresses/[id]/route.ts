import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { MOCK_SHIPPING_ADDRESSES } from "@/lib/mockData";

const globalForShipping = globalThis as unknown as {
  addresses?: { list: typeof MOCK_SHIPPING_ADDRESSES; nextId: number };
};

const initShippingAddresses = () => {
  if (!globalForShipping.addresses) {
    globalForShipping.addresses = {
      list: [...MOCK_SHIPPING_ADDRESSES],
      nextId: MOCK_SHIPPING_ADDRESSES.length + 1,
    };
  }
  return globalForShipping.addresses;
};

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorized();

    const { id } = await params;
    const store = initShippingAddresses();
    const index = store.list.findIndex(
      (item) => item.id === Number(id) && item.userId === user.userId,
    );
    if (index === -1) {
      return NextResponse.json(
        { message: "배송지를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    store.list.splice(index, 1);
    return NextResponse.json({ message: "삭제 완료" });
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
