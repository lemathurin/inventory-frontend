import { useEffect, useState } from "react";
import { getItemsOfHome } from "../endpoints/getItemsOfHome";
import { ItemModel } from "../item.types";

export function useGetItemsOfHome(homeId: string) {
  const [itemsData, setItemsData] = useState<ItemModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const itemsData = await getItemsOfHome(homeId);
        setItemsData(itemsData);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (homeId) {
      fetchItems();
    }
  }, [homeId]);

  return { itemsData, setItemsData, isLoading };
}
