"use client";
import { useGetItemById } from "@/domains/item/hooks/useGetItemById";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ItemModel } from "@/domains/item/item.types";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AppHeader } from "@/components/AppHeader";
import {
  Calendar,
  Eye,
  Shield,
  Clock,
  Euro,
  FileText,
  Square,
} from "lucide-react";

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
    <>
      <AppHeader
        breadcrumbs={[
          {
            label: item.rooms?.[0]?.name || "No room",
            href: `/home/${item.rooms?.[0]?.id}`,
          },
          { label: item.name, isCurrent: true },
        ]}
        actionButton={<Button>Edit item</Button>}
      />
      <div className="p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AspectRatio ratio={4 / 3} className="bg-muted" />
          <AspectRatio ratio={4 / 3} className="bg-muted" />
        </div>

        <h2 className="text-2xl font-semibold">{item.name}</h2>

        {item.description && (
          <Card className="p-4">
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <Label className="text-muted-foreground">Description</Label>
            </div>
            <p className="mt-2">{item.description}</p>
          </Card>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
          <Card className="p-4">
            <div className="flex items-center gap-1">
              <Euro className="h-4 w-4 text-muted-foreground" />
              <Label className="text-muted-foreground">Price</Label>
            </div>
            <p className="mt-2">€{item.price}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Label className="text-muted-foreground">Purchased</Label>
            </div>
            <p className="mt-2">
              {item.purchaseDate
                ? new Date(item.purchaseDate).toLocaleDateString()
                : "N/A"}
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4 text-muted-foreground" />
              <Label className="text-muted-foreground">Location</Label>
            </div>
            <p className="mt-2">
              {item.rooms?.[0]?.name || "No room assigned"}
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <Label className="text-muted-foreground">Visibility</Label>
            </div>
            <p className="mt-2">{item.public ? "Public" : "Private"}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <Label className="text-muted-foreground">Warranty</Label>
            </div>
            <p className="mt-2">
              {!item.hasWarranty
                ? "None"
                : item.warrantyType === "lifetime"
                  ? "Lifetime"
                  : "Extended"}
            </p>
          </Card>
          {item.hasWarranty && item.warrantyType === "extended" && (
            <Card className="p-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Label className="text-muted-foreground">Warranty Length</Label>
              </div>
              <p className="mt-2">{item.warrantyLength} years</p>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
