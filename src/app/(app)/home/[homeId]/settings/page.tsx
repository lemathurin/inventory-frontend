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
import { useHome } from "@/domains/home/home.context";
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useUpdateRoom } from "@/domains/room/hooks/useUpdateRoom";
import HomeRoomsCard from "@/components/HomeSettings/HomeRoomsCard";
import { useGetHomeUsers } from "@/domains/home/hooks/useGetHomeUsers";
import HomeUsersCard from "@/components/HomeSettings/HomeUsersCard";
import { UserModel } from "@/domains/user/user.types";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function HomeSettings() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<UserModel[]>([]);
  const updateHome = useUpdateHome();
  const { homeData } = useHome();
  const getRoomsByHomeId = useGetRoomsByHomeId();
  const getHomeUsers = useGetHomeUsers();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  const roomForm = useForm({
    defaultValues: {
      name: "",
    },
  });

  // Reset form values when homeData is available
  useEffect(() => {
    if (homeData) {
      form.reset({
        name: homeData.name,
        address: homeData.address,
      });
      fetchUsers();
    }
  }, [homeData, form]);

  async function fetchUsers() {
    if (!homeData) return;
    try {
      const fetchedUsers = await getHomeUsers(homeData.id);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
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

  if (!homeData) {
    return <div>Loading...</div>;
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

        <HomeRoomsCard homeId={homeData.id} />

        <HomeUsersCard
          homeId={homeData.id}
          users={users}
          onUsersUpdated={setUsers}
        />
      </div>
    </>
  );
}
