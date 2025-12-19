import { axiosInstance, type ApiResponse } from "./AxiosService";
import { API_PATHS } from "./apiPaths";
import type { RoastItem } from "../types/roast";

export async function getRoastList(): Promise<RoastItem[]> {
  const res = await axiosInstance.get<ApiResponse<RoastItem[]>>(API_PATHS.ROAST_LIST);
  return res.data.data;
}