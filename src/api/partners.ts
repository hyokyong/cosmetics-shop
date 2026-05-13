import { axiosWithAuth } from "@/api/axiosInstance";
import { Partner, PartnerCreateRequest } from "@/types/index";

export const getPartners = async (): Promise<Partner[]> => {
  const { data } = await axiosWithAuth.get("/admin/partners");
  return data;
};

export const postPartner = async (
  body: PartnerCreateRequest,
): Promise<Partner> => {
  const { data } = await axiosWithAuth.post("/admin/partners", body);
  return data;
};

export const patchPartnerActive = async (
  id: number,
  isActive: boolean,
): Promise<Partner> => {
  const { data } = await axiosWithAuth.patch(`/admin/partners/${id}/active`, {
    isActive,
  });
  return data;
};
