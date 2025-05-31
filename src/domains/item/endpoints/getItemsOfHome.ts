import { apiUrl } from "@/config/api";
import { ItemModel } from "../item.types";

export async function getItemsOfHome(homeId: string): Promise<ItemModel[]> {
  try {
    const response = await fetch(apiUrl(`/home/${homeId}/items`), {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const items: ItemModel[] = await response.json();
    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
}
