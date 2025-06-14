"use client";

import { useParams } from "next/navigation";
import { useGetItemsByRoom } from "@/domains/item/hooks/useGetItemsByRoom";
import { useEffect, useState } from "react";
import { ItemModel } from "@/domains/item/item.types";
import { AppHeader } from "@/components/AppHeader";
import { useGetRoomById } from "@/domains/room/hooks/useGetRoomById";
import { RoomModel } from "@/domains/room/room.types";
import { useGetRoomUsers } from "@/domains/room/hooks/useGetRoomUsers";
import ItemCard from "@/components/ItemCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useHome } from "@/domains/home/home.context";

interface RoomUserProps {
  id: string;
  isAdmin: boolean;
  name: string;
}

export default function RoomPage() {
  const { homeData } = useHome();
  const { roomId } = useParams<{ roomId: string }>();
  const getItemByRoom = useGetItemsByRoom();
  const getRoomById = useGetRoomById();
  const getRoomUsers = useGetRoomUsers();
  const [items, setItems] = useState<ItemModel[] | null>(null);
  const [roomData, setRoomData] = useState<RoomModel | null>(null);
  const [roomUsers, setRoomUsers] = useState<RoomUserProps[] | undefined>([]);

  useEffect(() => {
    if (!roomId) return;
    fetchRoomDetails();
    fetchItems();
    fetchRoomUsers();
  }, [roomId]);

  async function fetchRoomDetails() {
    try {
      const room = await getRoomById(roomId);
      setRoomData(room);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchRoomUsers() {
    try {
      const roomUsers = await getRoomUsers(roomId);
      setRoomUsers(roomUsers);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchItems() {
    try {
      const items = await getItemByRoom(roomId, {
        limit: 9,
        orderBy: "createdAt",
        orderDirection: "desc",
      });
      setItems(items);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <AppHeader
        breadcrumbs={[
          {
            label: roomData?.name || "Room",
            isCurrent: true,
          },
        ]}
        roomUsers={roomUsers}
        actionButton={
          <Link href={`/home/${homeData?.id}/create-item`}>
            <Button variant="outline">Create item</Button>
          </Link>
        }
      />
      <div className="p-4 text-primary flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <h2 className="text-3xl font-semibold">Newest items</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-4">
            {items?.map((item) => <ItemCard key={item.id} item={item} />)}
          </div>
        </div>
      </div>
    </>
  );
}
