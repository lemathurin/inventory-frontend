"use client";
import { useGetItemById } from "@/domains/item/hooks/useGetItemById";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ItemModel } from "@/domains/item/item.types";

import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ItemPage() {
  const { itemId } = useParams();
  const getItemById = useGetItemById();
  const [item, setItem] = useState<ItemModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!itemId) return;

    fetchItem();
  }, [itemId]);

  async function fetchItem() {
    try {
      setLoading(true);
      const data = await getItemById(itemId as string);
      setItem(data);
      console.log("Item data", data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch item");
      console.error("Error fetching item:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-primary">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!item) {
    return <div className="text-gray-500">Item not found</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AspectRatio ratio={4 / 3} className="bg-muted" />
        <AspectRatio ratio={4 / 3} className="bg-muted" />
      </div>

      <h2 className="text-2xl font-semibold">{item.name}</h2>

      {item.description && (
        <Card className="p-4">
          <Label className="text-muted-foreground">Description</Label>
          <p>{item.description}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
        {item.price && (
          <Card className="p-4">
            <Label className="text-muted-foreground">Price</Label>
            <p>€{item.price}</p>
          </Card>
        )}
        <Card className="p-4">
          <Label className="text-muted-foreground">Purchased</Label>
          <p className="text-lg font-medium">
            {item.purchaseDate
              ? new Date(item.purchaseDate).toLocaleDateString()
              : "N/A"}
          </p>
        </Card>
        <Card className="p-4">
          <Label className="text-muted-foreground">Location</Label>
          <p className="text-lg font-medium">
            {item.rooms?.[0]?.name || "No room assigned"}
          </p>
        </Card>
        <Card className="p-4">
          <Label className="text-muted-foreground">Visibility</Label>
          <p className="text-lg font-medium">
            {item.public ? "Public" : "Private"}
          </p>
        </Card>
        <Card className="p-4">
          <Label className="text-muted-foreground">Warranty</Label>
          <p className="text-lg font-medium">
            {!item.hasWarranty
              ? "None"
              : item.warrantyType === "lifetime"
                ? "Lifetime"
                : "Extended"}
          </p>
        </Card>
        {item.hasWarranty && item.warrantyType === "extended" && (
          <Card className="p-4">
            <Label className="text-muted-foreground">Warranty Length</Label>
            <p className="text-lg font-medium">{item.warrantyLength} years</p>
          </Card>
        )}
      </div>
    </div>
  );
}
