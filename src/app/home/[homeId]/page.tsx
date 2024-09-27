"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { apiUrl } from "@/config/api";

type Item = {
  id: string;
  name: string;
  description?: string;
  purchaseDate?: string;
  price?: number;
  warranty?: number;
  homeId: string;
  ownerId: string;
};

export default function Home() {
  const { homeId } = useParams();
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchItems();
  }, [homeId]);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Fetching items for homeId:", homeId);
      const response = await axios.get(apiUrl(`/homes/${homeId}/items`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Items received:", response.data.length);
      setItems(response.data);
    } catch (err) {
      setError("Failed to fetch items");
      console.error(err);
    }
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newItemName.trim()) {
      setError("Item name cannot be empty");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        apiUrl(`/homes/${homeId}/items`),
        { name: newItemName, description: newItemDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems([...items, response.data]);
      setNewItemName("");
      setNewItemDescription("");
    } catch (err: any) {
      console.error("Error adding item:", err);
      setError(
        "Failed to add item: " + (err.response?.data?.error || err.message)
      );
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
      const token = localStorage.getItem("token");
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
    } catch (err: any) {
      console.error("Error updating item:", err);
      setError(
        "Failed to update item: " + (err.response?.data?.error || err.message)
      );
    }
  };

  const deleteItem = async () => {
    if (!selectedItem) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(apiUrl(`/homes/${homeId}/items/${selectedItem.id}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter((item) => item.id !== selectedItem.id));
      closeItemDialog();
    } catch (err: any) {
      console.error("Error deleting item:", err);
      setError(
        "Failed to delete item: " + (err.response?.data?.error || err.message)
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Your Home Inventory
          </CardTitle>
          <CardDescription>Manage your household items here</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {items.length === 0 ? (
            <p className="text-center text-gray-500 my-4">
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
          )}
        </CardContent>
        <CardFooter>
          <form onSubmit={addItem} className="w-full space-y-4">
            <Input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Item name"
              required
            />
            <Input
              type="text"
              value={newItemDescription}
              onChange={(e) => setNewItemDescription(e.target.value)}
              placeholder="Item description"
            />
            <Button type="submit" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </form>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <form onSubmit={updateItem} className="space-y-4">
              <div>
                <Label htmlFor="id">ID (not editable)</Label>
                <Input id="id" value={selectedItem.id} disabled />
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={selectedItem.name}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={selectedItem.description || ""}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={
                    selectedItem.purchaseDate
                      ? new Date(selectedItem.purchaseDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
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
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={selectedItem.price || ""}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      price: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="warranty">Warranty (months)</Label>
                <Input
                  id="warranty"
                  type="number"
                  value={selectedItem.warranty || ""}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      warranty: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="homeId">Home ID (not editable)</Label>
                <Input id="homeId" value={selectedItem.homeId} disabled />
              </div>
              <div>
                <Label htmlFor="ownerId">Owner ID (not editable)</Label>
                <Input id="ownerId" value={selectedItem.ownerId} disabled />
              </div>
              <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
                <Button type="submit" className="w-full sm:w-auto">
                  Save changes
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full sm:w-auto"
                  onClick={deleteItem}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Item
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
