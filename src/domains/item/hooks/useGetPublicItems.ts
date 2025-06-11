import axios from "@/lib/axios";
import { ITEM_ENDPOINTS } from "../endpoints";
import { ItemModel } from "../item.types";

export function useGetPublicItems() {
  return async (
    homeId: string,
    options?: {
      limit?: number;
      orderBy?: "createdAt" | "name" | "price";
      orderDirection?: "asc" | "desc";
    },
  ): Promise<ItemModel[]> => {
    try {
      const endpoint = ITEM_ENDPOINTS.publicItems.replace(":homeId", homeId);
      const response = await axios.get<ItemModel[]>(endpoint, {
        params: options,
      });
      return response.data;
    } catch (error) {
      console.error("Could not fetch public items", error);
      throw error;
    }
  };
}
