import { axiosWithAuth } from "@/api/axiosInstance";
import { ShippingAddress, ShippingAddressCreateRequest } from "@/types/index";

export const getShippingAddresses = async (): Promise<ShippingAddress[]> => {
  const { data } = await axiosWithAuth.get("/shipping-addresses");
  return data;
};

export const postShippingAddress = async (
  body: ShippingAddressCreateRequest,
): Promise<ShippingAddress> => {
  const { data } = await axiosWithAuth.post("/shipping-addresses", body);
  return data;
};

export const deleteShippingAddress = async (id: number): Promise<void> => {
  const { data } = await axiosWithAuth.delete(`/shipping-addresses/${id}`);
  return data;
};
