import { axiosWithAuth } from "@/api/axiosInstance";
import { Order, OrderCreateRequest } from "@/types/index";

// 주문 생성
export const postOrder = async (body: OrderCreateRequest): Promise<Order> => {
  const { data } = await axiosWithAuth.post("/orders", body);
  return data;
};

// 내 주문 목록
export const getOrders = async (): Promise<Order[]> => {
  const { data } = await axiosWithAuth.get("/orders");
  return data;
};

// 주문 상세
export const getOrder = async (id: number): Promise<Order> => {
  const { data } = await axiosWithAuth.get(`/orders/${id}`);
  return data;
};

// 주문 취소 (주문완료 상태일 때만)
export const deleteOrder = async (id: number): Promise<void> => {
  const { data } = await axiosWithAuth.delete(`/orders/${id}`);
  return data;
};
