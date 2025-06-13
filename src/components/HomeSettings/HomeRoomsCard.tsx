"use client";

import { useEffect, useState } from "react";
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
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useUpdateRoom } from "@/domains/room/hooks/useUpdateRoom";
import { useGetRoomsByHomeId } from "@/domains/home/hooks/useGetRoomsByHomeId";
import { Label } from "../ui/label";
import { useGetHomeUsers } from "@/domains/home/hooks/useGetHomeUsers";
import { useAddUserToRoom } from "@/domains/room/hooks/useAddUserToRoom";
import { useRemoveUserFromRoom } from "@/domains/room/hooks/useRemoveUserFromRoom";
import { useGetRoomById } from "@/domains/room/hooks/useGetRoomById";
import { UserModel } from "@/domains/user/user.types";

export default function HomeRoomsCard({ homeId }: { homeId: string }) {
  const getRoomsByHomeId = useGetRoomsByHomeId();
  const getHomeUsers = useGetHomeUsers();
  const addUserToRoom = useAddUserToRoom();
  const removeUserFromRoom = useRemoveUserFromRoom();
  const updateRoom = useUpdateRoom();
  const getRoomById = useGetRoomById();
  const [rooms, setRooms] = useState<RoomModel[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<RoomModel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<UserModel[]>([]);
  const [roomUsers, setRoomUsers] = useState<string[]>([]);

  const roomForm = useForm({
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    fetchRooms();
    fetchUsers();
  }, [homeId]);

  async function fetchRooms() {
    try {
      const fetchedRooms = await getRoomsByHomeId(homeId);
      setRooms(fetchedRooms);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    }
  }

  async function fetchUsers() {
    try {
      const fetchedUsers = await getHomeUsers(homeId);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }

  async function handleRoomUpdate(data: { name: string }) {
    if (!currentRoom) return;

    setIsSubmitting(true);
    try {
      await updateRoom(currentRoom.id, data.name);
      toast.success("Room updated successfully");
      await fetchRooms(); // Refresh the list
      closeEditDialog();
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error("Failed to update room");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function openEditDialog(room: RoomModel) {
    setCurrentRoom(room);
    roomForm.reset({ name: room.name });
    setIsDialogOpen(true);

    try {
      const roomDetails = await getRoomById(room.id);
      setRoomUsers(roomDetails.users?.map((user) => user.userId) || []);
    } catch (error) {
      console.error("Failed to fetch room details:", error);
    }
  }

  const closeEditDialog = () => {
    setIsDialogOpen(false);
    setCurrentRoom(null);
    roomForm.reset();
    setRoomUsers([]);
  };

  async function handleAddUserToRoom(userId: string) {
    if (!currentRoom) return;
    try {
      await addUserToRoom(currentRoom.id, userId);
      toast.success("User added to room successfully");
      const roomDetails = await getRoomById(currentRoom.id);
      setRoomUsers(roomDetails.users?.map((user) => user.userId) || []);
    } catch (error) {
      console.error("Failed to add user to room:", error);
    }
  }

  async function handleRemoveUserFromRoom(userId: string) {
    if (!currentRoom) return;

    try {
      const roomDetails = await getRoomById(currentRoom.id);
      const userToRemove = roomDetails.users?.find(
        (user) => user.userId === userId,
      );

      if (userToRemove?.admin) {
        toast.error("Cannot remove a room admin.");
        return;
      }

      await removeUserFromRoom(currentRoom.id, userId);
      toast.success("User removed from room successfully");
      const updatedRoomDetails = await getRoomById(currentRoom.id);
      setRoomUsers(updatedRoomDetails.users?.map((user) => user.userId) || []);
    } catch (error) {
      console.error("Failed to remove user from room:", error);
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
            {rooms
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((room) => (
                <TableRow key={room.id}>
                  <TableCell>{room.name}</TableCell>
                  <TableCell>{room.users?.length || 0}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => openEditDialog(room)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeEditDialog();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>
              Update the room details below.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={roomForm.handleSubmit(handleRoomUpdate)}
            className="space-y-4"
          >
            <div className="grid gap-3">
              <Label htmlFor="room-name">Room Name</Label>
              <Input
                id="room-name"
                {...roomForm.register("name")}
                placeholder="Enter room name"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="users">Add Users</Label>
              <div className="max-h-60 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell className="text-right">Action</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.userId}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant={
                              roomUsers.includes(user.userId)
                                ? "destructive"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              roomUsers.includes(user.userId)
                                ? handleRemoveUserFromRoom(user.userId)
                                : handleAddUserToRoom(user.userId)
                            }
                            disabled={
                              roomUsers.includes(user.userId) && user.admin
                            }
                          >
                            {roomUsers.includes(user.userId) ? "Remove" : "Add"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={closeEditDialog}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
