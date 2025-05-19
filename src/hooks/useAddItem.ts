import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/config/api';
interface AddItemData {
  name: string;
  description?: string;
}
export const useAddItem = (homeId: string) => {
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]); // Remplacez `any` par le type approprié pour vos items
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemDescription, setNewItemDescription] = useState<string>('');
  const router = useRouter();
  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!newItemName.trim()) {
      setError('Item name cannot be empty');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        apiUrl(`/homes/${homeId}/items`),
        { name: newItemName, description: newItemDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems([...items, response.data]);
      setNewItemName('');
      setNewItemDescription('');
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error adding item:', error);
        setError('Failed to add item: ' + (error.response?.data?.error || error.message));
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };
  return {
    addItem,
    error,
    newItemName,
    setNewItemName,
    newItemDescription,
    setNewItemDescription,
    items,
  };
};