"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { useUpdateHome } from "@/domains/home/hooks/useUpdateHome";
import { useHome } from "@/contexts/home.context";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetRoomsByHomeId } from "@/domains/home/hooks/useGetRoomsByHomeId";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { RoomModel } from "@/domains/room/room.types";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function HomeSettings() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rooms, setRooms] = useState<RoomModel[]>([]);
  const updateHome = useUpdateHome();
  const { homeData } = useHome();
  const getRoomsByHomeId = useGetRoomsByHomeId();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  // Reset form values when homeData is available
  useEffect(() => {
    if (homeData) {
      form.reset({
        name: homeData.name,
        address: homeData.address,
      });
      fetchRooms();
    }
  }, [homeData, form]);

  async function fetchRooms() {
    try {
      const data = await getRoomsByHomeId(homeData!.id);
      setRooms(data);
    } catch (err) {
      console.error("Error fetching rooms", err);
    }
  }

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    try {
      await updateHome(homeData!.id, data.name, data.address);
      toast.success("Home details updated successfully");
    } catch (error) {
      console.error("Error updating home details:", error);
      toast.error("An error occurred while updating home details");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <AppHeader breadcrumbs={[{ label: "Home settings", isCurrent: true }]} />
      <div className="p-4">
        <Toaster richColors position="bottom-right" />
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Home Settings</CardTitle>
            <CardDescription>Update your home details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter home name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter home address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Rooms</CardTitle>
            <CardDescription>Manage your rooms</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Room Name</TableCell>
                  <TableCell>Users</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>{room.name}</TableCell>
                    <TableCell>{room.users?.length || 0}</TableCell>
                    <TableCell>{/* Action buttons will go here */}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
