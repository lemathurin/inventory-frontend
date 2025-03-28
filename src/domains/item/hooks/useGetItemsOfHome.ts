import { useEffect, useState } from 'react';
import { getItemsOfHome } from '../endpoints/getItemsOfHome';
import { ItemModel } from '../item.types';

export function useGetItemsOfHome(homeId: string) {
  const [items, setItems] = useState<ItemModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const itemsData = await getItemsOfHome(homeId);
        setItems(itemsData);
      } catch (err) {
        console.error('Error fetching items:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (homeId) {
      fetchItems();
    }
  }, [homeId]);

  return { items, setItems, isLoading };
}