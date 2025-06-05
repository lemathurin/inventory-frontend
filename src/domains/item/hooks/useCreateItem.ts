import axios from "@/lib/axios";
import { ITEM_ENDPOINTS } from "../endpoints";

export function useCreateItem() {
  return async (
    homeId: string,
    name: string,
    roomId: string,
    description?: string,
    isPublic?: boolean,
    purchaseDate?: string,
    price?: number,
    hasWarranty?: boolean,
    warrantyType?: string,
    warrantyLength?: number,
  ): Promise<void> => {
    try {
      const endpoint = ITEM_ENDPOINTS.createItem.replace(":homeId", homeId);
      await axios.post(endpoint, {
        name,
        roomId,
        description,
        public: isPublic,
        purchaseDate,
        price,
        hasWarranty,
        warrantyType,
        warrantyLength,
      });
    } catch (error) {
      console.error("Could not create item", error);
      throw error;
    }
  };
}
