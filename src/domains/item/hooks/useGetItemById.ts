import axios from "@/lib/axios";
import { ITEM_ENDPOINTS } from "../endpoints";
import { ItemModel } from "../item.types";

export function useGetItemById() {
  return async (itemId: string): Promise<ItemModel> => {
    try {
      const response = await axios.get<ItemModel>(
        `${ITEM_ENDPOINTS.item}/${itemId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Could not fetch item", error);
      throw error;
    }
  };
}
