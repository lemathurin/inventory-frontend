"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Item = {
  id: number;
  name: string;
  description: string;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(response.data);
    } catch (err) {
      setError("Failed to fetch items");
    }
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/items",
        { name: newItemName, description: newItemDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems([...items, response.data]);
      setNewItemName("");
      setNewItemDescription("");
    } catch (err) {
      setError("Failed to add item");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-2xl font-semibold mb-4">Your Home Inventory</h1>
          {items.length === 0 ? (
            <p>You have no items yet. Add your first item below!</p>
          ) : (
            <ul className="mb-4">
              {items.map((item) => (
                <li key={item.id} className="mb-2">
                  <strong>{item.name}</strong>: {item.description}
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={addItem} className="mt-4">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Item name"
              className="mb-2 w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              value={newItemDescription}
              onChange={(e) => setNewItemDescription(e.target.value)}
              placeholder="Item description"
              className="mb-2 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Add Item
            </button>
          </form>
          {error && (
            <p className="mt-2 text-center text-sm text-red-600">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
