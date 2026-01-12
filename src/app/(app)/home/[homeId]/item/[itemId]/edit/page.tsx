"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetItemById } from "@/domains/item/hooks/useGetItemById";
import { useGetItemPermissions } from "@/domains/item/hooks/useGetItemPermissions";
import { ItemModel } from "@/domains/item/item.types";
import EditItemForm from "@/components/EditItemForm";
import { AppHeader } from "@/components/AppHeader";

export default function EditItemPage() {
  const { homeId, itemId } = useParams<{ homeId: string; itemId: string }>();
  const getItemById = useGetItemById();
  const getItemPermissions = useGetItemPermissions();
  const [item, setItem] = useState<ItemModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isItemAdmin, setIsItemAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!itemId) return;
    fetchItem();
    fetchPermissions();
  }, [itemId]);

  async function fetchItem() {
    try {
      setLoading(true);
      const data = await getItemById(itemId as string);
      setItem(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch item");
    } finally {
      setLoading(false);
    }
  }

  async function fetchPermissions() {
    try {
      const permissions = await getItemPermissions(itemId);
      setIsItemAdmin(permissions.admin);
    } catch (err) {
      console.error(err);
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

  if (!isItemAdmin) {
    return (
      <div className="text-red-500">
        You do not have permission to edit this item.
      </div>
    );
  }

  return (
    <>
      <AppHeader
        breadcrumbs={[
          {
            label: item.rooms?.[0]?.name || "No room",
            href: `/home/${homeId}/room/${item.rooms?.[0]?.id}`,
          },
          {
            label: item.name,
            href: `/home/${homeId}/item/${itemId}`,
          },
          { label: "Edit item", isCurrent: true },
        ]}
      />
      <div className="m-4">
        <EditItemForm
          item={item}
          onSuccess={() => router.push(`/home/${homeId}/item/${itemId}`)}
          onCancel={() => router.push(`/home/${homeId}/item/${itemId}`)}
        />
      </div>
    </>
  );
}
