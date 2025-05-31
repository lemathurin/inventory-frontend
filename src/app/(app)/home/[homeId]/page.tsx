'use client';

<<<<<<< HEAD:src/app/home/[homeId]/page.tsx
import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
=======
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
>>>>>>> dev:src/app/(app)/home/[homeId]/page.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
<<<<<<< HEAD:src/app/home/[homeId]/page.tsx
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { apiUrl } from '@/config/api';

type Item = {
  id: string;
  name: string;
  description?: string;
  purchaseDate?: string;
  price?: number;
  warranty?: number;
  homeId: string;
  userId: string;
};

export default function Home() {
  const { homeId } = useParams();
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
=======
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { apiUrl } from "@/config/api";
import { useGetItemsOfHome } from "@/domains/item/hooks/useGetItemsOfHome";
import { ItemModel } from "@/domains/item/item.types";
import { useGetHomeById } from "@/domains/home/hooks/useGetHomeById";

export default function HomePage() {
  const { homeId } = useParams<{ homeId: string }>();
  const { homeData } = useGetHomeById(homeId);
  const { itemsData } = useGetItemsOfHome(homeId);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
>>>>>>> dev:src/app/(app)/home/[homeId]/page.tsx
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ItemModel | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
<<<<<<< HEAD:src/app/home/[homeId]/page.tsx
  const router = useRouter();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching items for homeId:', homeId);

      // CORRIGÉ: Endpoint avec /homes/
      const response = await axios.get(apiUrl(`/api/homes/${homeId}/items`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Items received:', response.data.length);
      setItems(response.data);
    } catch (err) {
      console.error('Fetch items error:', err);
      if (axios.isAxiosError(err)) {
        console.log('API Error:', err.response?.status, err.response?.data);
      }
      setError('Failed to fetch items');
    }
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
=======
  const [items, setItems] = useState<ItemModel[]>([]);

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
>>>>>>> dev:src/app/(app)/home/[homeId]/page.tsx

    if (!newItemName.trim()) {
      setError('Item name cannot be empty');
      return;
    }

    try {
<<<<<<< HEAD:src/app/home/[homeId]/page.tsx
      const token = localStorage.getItem('token');

      // CORRIGÉ: Endpoint avec /homes/ et /items (pluriel)
      const response = await axios.post(
        apiUrl(`/api/homes/${homeId}/item`),
        { name: newItemName, description: newItemDescription },
        { headers: { Authorization: `Bearer ${token}` } }
=======
      const response = await axios.post(
        apiUrl(`/home/${homeId}/item`),
        {
          name: newItemName,
          description: newItemDescription,
        },
        {
          withCredentials: true,
        },
>>>>>>> dev:src/app/(app)/home/[homeId]/page.tsx
      );

      setItems([...items, response.data]);
      setNewItemName('');
      setNewItemDescription('');
    } catch (error) {
      console.error('Add item error:', error);
      if (error instanceof AxiosError) {
        console.log('API Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
        setError(
<<<<<<< HEAD:src/app/home/[homeId]/page.tsx
          'Failed to add item: ' +
            (error.response?.data?.error ||
              error.response?.data?.message ||
              error.message)
=======
          "Failed to add item: " +
            (error.response?.data?.error || error.message),
>>>>>>> dev:src/app/(app)/home/[homeId]/page.tsx
        );
      }
    }
  };

  const openItemDialog = (item: ItemModel) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const closeItemDialog = () => {
    setSelectedItem(null);
    setIsDialogOpen(false);
  };

  const updateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
<<<<<<< HEAD:src/app/home/[homeId]/page.tsx
      const token = localStorage.getItem('token');

      // CORRIGÉ: Endpoint avec /homes/
      const response = await axios.put(
        apiUrl(`/api/homes/${homeId}/items/${selectedItem.id}`),
=======
      const response = await axios.put(
        apiUrl(`/home/${homeId}/item/${selectedItem.id}`),
>>>>>>> dev:src/app/(app)/home/[homeId]/page.tsx
        selectedItem,
        {
          withCredentials: true,
        },
      );

      setItems(
        items.map((item) =>
          item.id === selectedItem.id ? response.data : item,
        ),
      );
      closeItemDialog();
    } catch (error) {
      console.error('Update item error:', error);
      if (error instanceof AxiosError) {
        setError(
<<<<<<< HEAD:src/app/home/[homeId]/page.tsx
          'Failed to update item: ' +
            (error.response?.data?.error || error.message)
=======
          "Failed to update item: " +
            (error.response?.data?.error || error.message),
>>>>>>> dev:src/app/(app)/home/[homeId]/page.tsx
        );
      }
    }
  };

  const deleteItem = async () => {
    if (!selectedItem) return;

    try {
<<<<<<< HEAD:src/app/home/[homeId]/page.tsx
      const token = localStorage.getItem('token');

      // CORRIGÉ: Endpoint avec /homes/
      await axios.delete(
        apiUrl(`/api/homes/${homeId}/items/${selectedItem.id}`),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

=======
      await axios.delete(apiUrl(`/home/${homeId}/item/${selectedItem.id}`), {
        withCredentials: true,
      });
>>>>>>> dev:src/app/(app)/home/[homeId]/page.tsx
      setItems(items.filter((item) => item.id !== selectedItem.id));
      closeItemDialog();
    } catch (error) {
      console.error('Delete item error:', error);
      if (error instanceof AxiosError) {
        setError(
<<<<<<< HEAD:src/app/home/[homeId]/page.tsx
          'Failed to delete item: ' +
            (error.response?.data?.error || error.message)
=======
          "Failed to delete item: " +
            (error.response?.data?.error || error.message),
>>>>>>> dev:src/app/(app)/home/[homeId]/page.tsx
        );
      }
    }
  };

  return (
<<<<<<< HEAD:src/app/home/[homeId]/page.tsx
    <div className='min-h-screen bg-gray-100 p-8'>
      <Card className='max-w-4xl mx-auto'>
        <CardHeader>
          <CardTitle className='text-3xl font-bold'>
            Your Home Inventory
          </CardTitle>
          <CardDescription>Manage your household items here</CardDescription>
          <Button
            onClick={() => {
              router.push(`/${homeId}`);
            }}
            aria-label='Settings'
          >
            Home settings
          </Button>
=======
    <div className="min-h-screen p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {homeData ? homeData.name : "Your Home Inventory"}
          </CardTitle>
          <CardDescription>Manage your household items here</CardDescription>
>>>>>>> dev:src/app/(app)/home/[homeId]/page.tsx
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant='destructive' className='mb-4'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
<<<<<<< HEAD:src/app/home/[homeId]/page.tsx
          {items.length === 0 ? (
            <p className='text-center text-gray-500 my-4'>
              You have no items yet. Add your first item below!
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className='font-medium'>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => openItemDialog(item)}
                      >
                        <Edit className='h-4 w-4 mr-2' /> Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
=======
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itemsData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openItemDialog(item)}
                    >
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
>>>>>>> dev:src/app/(app)/home/[homeId]/page.tsx
        </CardContent>
        <CardFooter>
          <form onSubmit={addItem} className='w-full space-y-4'>
            <Input
              type='text'
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder='Item name'
              required
            />
            <Input
              type='text'
              value={newItemDescription}
              onChange={(e) => setNewItemDescription(e.target.value)}
              placeholder='Item description'
            />
            <Button type='submit' className='w-full'>
              <PlusCircle className='mr-2 h-4 w-4' /> Add Item
            </Button>
          </form>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
<<<<<<< HEAD:src/app/home/[homeId]/page.tsx
        <DialogContent className='bg-white sm:max-w-[425px]'>
=======
        <DialogContent className="bg-white text-black sm:max-w-[425px]">
>>>>>>> dev:src/app/(app)/home/[homeId]/page.tsx
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <form onSubmit={updateItem} className='space-y-4'>
              <div>
                <Label htmlFor='id'>ID (not editable)</Label>
                <Input id='id' value={selectedItem.id} disabled />
              </div>
              <div>
                <Label htmlFor='name'>Name</Label>
                <Input
                  id='name'
                  value={selectedItem.name}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor='description'>Description</Label>
                <Input
                  id='description'
                  value={selectedItem.description || ''}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor='purchaseDate'>Purchase Date</Label>
                <Input
                  id='purchaseDate'
                  type='date'
                  value={
                    selectedItem.purchaseDate
                      ? new Date(selectedItem.purchaseDate)
                          .toISOString()
                          .split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      purchaseDate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor='price'>Price</Label>
                <Input
                  id='price'
                  type='number'
                  value={selectedItem.price || ''}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      price: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor='warranty'>Warranty (months)</Label>
                <Input
                  id='warranty'
                  type='number'
                  value={selectedItem.warranty || ''}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      warranty: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor='homeId'>Home ID (not editable)</Label>
                <Input id='homeId' value={selectedItem.homeId} disabled />
              </div>
              <div>
                <Label htmlFor='ownerId'>Owner ID (not editable)</Label>
                <Input id='ownerId' value={selectedItem.userId} disabled />
              </div>
              <DialogFooter className='flex flex-col sm:flex-row sm:justify-between gap-2'>
                <Button type='submit' className='w-full sm:w-auto'>
                  Save changes
                </Button>
                <Button
                  type='button'
                  variant='destructive'
                  className='w-full sm:w-auto'
                  onClick={deleteItem}
                >
                  <Trash2 className='h-4 w-4 mr-2' /> Delete Item
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
