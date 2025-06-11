"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { RoomModel } from "@/domains/room/room.types";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useUpdateRoom } from "@/domains/room/hooks/useUpdateRoom";
import { useGetRoomsByHomeId } from "@/domains/home/hooks/useGetRoomsByHomeId";

interface HomeRoomsCardProps {
  homeId: string;
  rooms: RoomModel[];
  onRoomsUpdated: (rooms: RoomModel[]) => void;
}

export default function HomeRoomsCard({
  homeId,
  rooms,
  onRoomsUpdated,
}: HomeRoomsCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateRoom = useUpdateRoom();
  const getRoomsByHomeId = useGetRoomsByHomeId();
  const roomForm = useForm({
    defaultValues: {
      name: "",
    },
  });

  async function handleRoomUpdate(roomId: string, name: string) {
    setIsSubmitting(true);
    try {
      await updateRoom(roomId, name);
      toast.success("Room updated successfully");
      const updatedRooms = await getRoomsByHomeId(homeId);
      onRoomsUpdated(updatedRooms);
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error("An error occurred while updating the room");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle>Rooms</CardTitle>
          <CardDescription>Manage your rooms</CardDescription>
        </div>
        <Button variant="secondary">Create a room</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Room Name</TableCell>
              <TableCell>Users</TableCell>
              <TableCell className="text-center">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>{room.name}</TableCell>
                <TableCell>{room.users?.length || 0}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Room</DialogTitle>
                        <DialogDescription>
                          Update the room details below.
                        </DialogDescription>
                      </DialogHeader>
                      <form
                        onSubmit={roomForm.handleSubmit((data) => {
                          handleRoomUpdate(room.id, data.name);
                        })}
                        className="space-y-4"
                      >
                        <div>
                          <label>Room Name</label>
                          <Input
                            {...roomForm.register("name")}
                            defaultValue={room.name}
                            placeholder="Enter room name"
                          />
                        </div>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
