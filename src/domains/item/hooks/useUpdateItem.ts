import axios from "@/lib/axios";
import { ITEM_ENDPOINTS } from "../endpoints";

export function useUpdateItem() {
  return async (
    itemId: string,
    name?: string,
    description?: string,
    roomId?: string,
    isPublic?: boolean,
    purchaseDate?: Date,
    price?: number,
    hasWarranty?: boolean,
    warrantyType?: string,
    warrantyLength?: number,
  ): Promise<void> => {
    try {
      const endpoint = ITEM_ENDPOINTS.item.replace(":itemId", itemId);
      await axios.patch(endpoint, {
        name,
        description,
        roomId,
        public: isPublic,
        purchaseDate,
        price,
        hasWarranty,
        warrantyType,
        warrantyLength,
      });
    } catch (error) {
      console.error("Could not update item", error);
      throw error;
    }
  };
}
