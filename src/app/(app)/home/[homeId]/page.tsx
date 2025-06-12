"use client";

import { useHome } from "@/domains/home/home.context";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ItemCard from "@/components/ItemCard";
import { ItemModel } from "@/domains/item/item.types";
import { useGetItemsByHome } from "@/domains/item/hooks/useGetItemsByHome";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { homeData } = useHome();
  const getItemsByHome = useGetItemsByHome();
  const [latestPublicItems, setLatestPublicItems] = useState<ItemModel[]>([]);

  useEffect(() => {
    if (!homeData) return;
    async function fetchLatestPublicItems() {
      try {
        const items = await getItemsByHome(homeData!.id, {
          limit: 9,
          orderBy: "createdAt",
          orderDirection: "desc",
        });
        setLatestPublicItems(items);
        console.log("Items data", items);
      } catch (err) {
        console.error(err);
      }
    }
    fetchLatestPublicItems();
  }, [homeData?.id]);

  if (!homeData) {
    return null;
  }

  return (
    <>
      <AppHeader
        breadcrumbs={[{ label: "Dashboard", isCurrent: true }]}
        actionButton={
          <Link href={`/home/${homeData.id}/create-item`}>
            <Button variant="outline">Create item</Button>
          </Link>
        }
      />
      <div className="p-4 text-primary flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <h2 className="text-3xl font-semibold">Newest items</h2>
            <Button disabled variant="link">
              See more
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-4">
            {latestPublicItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <h2 className="text-3xl font-semibold">Recently modified rooms</h2>
            <Button disabled variant="link">
              See more
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-4"></div>
        </div>
      </div>
    </>
  );
}
