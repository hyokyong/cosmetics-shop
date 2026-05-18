import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { MOCK_SHIPPING_ADDRESSES } from "@/lib/mockData";
import type { ShippingAddressCreateRequest } from "@/types/index";

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

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorized();

    const store = initShippingAddresses();
    const userAddresses = store.list.filter(
      (addr) => addr.userId === user.userId,
    );
    return NextResponse.json(userAddresses);
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

    const store = initShippingAddresses();
    const created = {
      id: store.nextId,
      userId: user.userId,
      address,
      detailAddress,
      zipCode,
    };
    store.nextId += 1;
    store.list.push(created);

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
