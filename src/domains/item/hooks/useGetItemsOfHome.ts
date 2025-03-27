import { useEffect, useState } from 'react';
import { getItemsOfHome } from '../endpoints/getItemsOfHome';
import { Item } from '../item.types';

export function useGetItemsOfHome(homeId: string) {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const itemsData = await getItemsOfHome(homeId);
        setItems(itemsData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    if (homeId) {
      fetchItems();
    }
  }, [homeId]);

  return { items, setItems, isLoading, error };
}