import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth";

const ORDER_STATUS_MAP: Record<string, string> = {
  PENDING: "주문완료",
  CONFIRMED: "주문완료",
  SHIPPED: "배송중",
  DELIVERED: "배송완료",
  CANCELLED: "취소",
};

const mapOrder = (order: any) => ({
  id: order.id,
  userId: order.userId,
  status: ORDER_STATUS_MAP[order.status] ?? order.status,
  totalPrice: order.totalPrice,
  items: order.orderItems.map((item: any) => ({
    id: item.id,
    productId: item.productId,
    productName: item.product?.name ?? "",
    imageUrl: item.product?.imageUrl ?? "",
    optionId: item.optionId,
    color: item.option?.color ?? "",
    size: item.option?.size ?? "",
    price: item.price,
    quantity: item.quantity,
  })),
  shippingAddressId: order.shippingAddressId,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
});

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
      include: {
        orderItems: { include: { product: true, option: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ message: "주문이 없습니다." }, { status: 404 });
    }

    return NextResponse.json(mapOrder(order));
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}

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
      return NextResponse.json({ message: "주문이 없습니다." }, { status: 404 });
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
