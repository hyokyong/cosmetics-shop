import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { MOCK_ORDERS } from "@/lib/mockData";

const ORDER_STATUS_MAP: Record<string, string> = {
  PENDING: "주문완료",
  CONFIRMED: "주문완료",
  SHIPPED: "배송중",
  DELIVERED: "배송완료",
  CANCELLED: "취소",
};

const mapOrder = (order: any) => ({
  ...order,
  status: ORDER_STATUS_MAP[order.status] ?? order.status,
});

// GET /api/orders - 내 주문 목록
export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorized();

    const orders = await prisma.order.findMany({
      where: { userId: user.userId },
      include: { orderItems: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });

    if (orders.length === 0) {
      return NextResponse.json(
        MOCK_ORDERS.filter((order) => order.userId === user.userId),
      );
    }

    return NextResponse.json(orders.map(mapOrder));
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}

// POST /api/orders - 주문 생성
export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorized();

    const { items } = await req.json();
    // items: [{ productId, quantity, price }]

    const order = await prisma.order.create({
      data: {
        userId: user.userId,
        orderItems: {
          create: items.map(
            (item: { productId: number; quantity: number; price: number }) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            }),
          ),
        },
      },
      include: { orderItems: { include: { product: true } } },
    });

    return NextResponse.json(mapOrder(order), { status: 201 });
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
