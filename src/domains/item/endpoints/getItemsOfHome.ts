import { apiUrl } from "@/config/api";
import { Item } from "../item.types"

export async function getItemsOfHome(homeId: string): Promise<Item[]> {
  try {
    const response = await fetch(apiUrl(`/homes/${homeId}/items`), {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const items: Item[] = await response.json();
    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
}
