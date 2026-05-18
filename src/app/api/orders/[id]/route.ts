import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, forbidden } from "@/lib/auth";
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

// GET /api/orders/:id - 주문 상세
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorized();

    const { id } = await params;
    const order = await prisma.order.findFirst({
      where: { id: Number(id), userId: user.userId },
      include: { orderItems: { include: { product: true } } },
    });

    if (!order) {
      const mock = MOCK_ORDERS.find(
        (item) => item.id === Number(id) && item.userId === user.userId,
      );
      if (mock) return NextResponse.json(mock);

      return NextResponse.json(
        { message: "주문이 없습니다." },
        { status: 404 },
      );
    }

    return NextResponse.json(mapOrder(order));
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}

// DELETE /api/orders/:id - 주문 취소
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorized();

    const { id } = await params;
    const order = await prisma.order.findFirst({
      where: { id: Number(id), userId: user.userId },
    });

    if (!order) {
      return NextResponse.json(
        { message: "주문이 없습니다." },
        { status: 404 },
      );
    }
    if (order.status !== "PENDING") {
      return NextResponse.json(
        { message: "취소할 수 없는 주문입니다." },
        { status: 400 },
      );
    }

    await prisma.order.update({
      where: { id: Number(id) },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ message: "주문 취소 완료" });
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
