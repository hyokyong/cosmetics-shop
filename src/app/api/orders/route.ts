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

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorized();

    const orders = await prisma.order.findMany({
      where: { userId: user.userId },
      include: {
        orderItems: { include: { product: true, option: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders.map(mapOrder));
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorized();

    const { items, shippingAddressId } = await req.json();
    // items: [{ productId, optionId, quantity }]

    const itemDetails = await Promise.all(
      items.map(async (item: { productId: number; optionId?: number }) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        const option = item.optionId
          ? await prisma.productOption.findUnique({ where: { id: item.optionId } })
          : null;
        return { product, option };
      }),
    );

    const totalPrice = items.reduce((sum: number, item: any, i: number) => {
      const { product, option } = itemDetails[i];
      if (!product) return sum;
      return sum + (product.basePrice + (option?.additionalPrice ?? 0)) * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        userId: user.userId,
        totalPrice,
        shippingAddressId: shippingAddressId ?? null,
        orderItems: {
          create: items.map((item: any, i: number) => {
            const { product, option } = itemDetails[i];
            return {
              productId: item.productId,
              optionId: item.optionId ?? null,
              quantity: item.quantity,
              price: (product?.basePrice ?? 0) + (option?.additionalPrice ?? 0),
            };
          }),
        },
      },
      include: {
        orderItems: { include: { product: true, option: true } },
      },
    });

    return NextResponse.json(mapOrder(order), { status: 201 });
  } catch {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
