'use client';

import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching items for homeId:', homeId);
      const response = await axios.get(apiUrl(`/homes/${homeId}/items`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Items received:', response.data.length);
      setItems(response.data);
    } catch (err) {
      setError('Failed to fetch items');
      console.error(err);
    }
  };

  const addItem = async (e: React.FormEvent) => {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Reset any existing error messages
    setError('');

    // Check if the new item name is empty or consists only of whitespace
    if (!newItemName.trim()) {
      setError('Item name cannot be empty'); // Set an error message if the item name is empty
      return; // Exit the function early if the item name is invalid
    }
    try {
      // Retrieve the authentication token from local storage
      const token = localStorage.getItem('token');

      // Make a POST request to add a new item to the specified home
      const response = await axios.post(
        apiUrl(`/homes/${homeId}/items`), // Construct the URL with the homeId
        { name: newItemName, description: newItemDescription }, // Data to be sent in the request body
        { headers: { Authorization: `Bearer ${token}` } } // Include the token in the request headers for authentication
      );
      // Update the items state with the newly added item
      setItems([...items, response.data]);

      // Reset the input fields for the new item
      setNewItemName('');
      setNewItemDescription('');
    } catch (error) {
      // Handle any errors that occur during the request
      if (error instanceof AxiosError) {
        // Check if the error is an AxiosError
        console.error('Error adding item:', error); // Log the error to the console
        // Set an error message based on the response from the server or the error message
        setError(
          'Failed to add item: ' +
            (error.response?.data?.error || error.message) // Use the error message from the response if available
        );
      }
    }
  };
  const openItemDialog = (item: Item) => {
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
      const token = localStorage.getItem('token');
      const response = await axios.put(
        apiUrl(`/homes/${homeId}/items/${selectedItem.id}`),
        selectedItem,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems(
        items.map((item) =>
          item.id === selectedItem.id ? response.data : item
        )
      );
      closeItemDialog();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error updating item:', error);
        setError(
          'Failed to update item: ' +
            (error.response?.data?.error || error.message)
        );
      }
    }
  };

  const deleteItem = async () => {
    if (!selectedItem) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(apiUrl(`/homes/${homeId}/items/${selectedItem.id}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter((item) => item.id !== selectedItem.id));
      closeItemDialog();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error deleting item:', error);
        setError(
          'Failed to delete item: ' +
            (error.response?.data?.error || error.message)
        );
      }
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <Card className='max-w-4xl mx-auto'>
        <CardHeader>
          <CardTitle className='text-3xl font-bold'>
            Your Home Inventory
          </CardTitle>
          <CardDescription>Manage your household items here</CardDescription>
          <Button
            onClick={() => {
              router.push(`/home/${homeId}/settings`);
            }}
            aria-label='Settings'
          >
            Home settings
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant='destructive' className='mb-4'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
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
        <DialogContent className='bg-white sm:max-w-[425px]'>
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
                <Input id='ownerId' value={selectedItem.ownerId} disabled />
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
