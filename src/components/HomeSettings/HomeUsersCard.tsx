"use client";

import { useState, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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
import { UserModel } from "@/domains/user/user.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRemoveUserFromHome } from "@/domains/home/hooks/useRemoveUserFromHome";
import { useGetHomeUsers } from "@/domains/home/hooks/useGetHomeUsers";
import { useGetHomeInvite } from "@/domains/home/hooks/useGetHomeInvite";
import { useCreateHomeInvite } from "@/domains/home/hooks/useCreateHomeInvite";
import { useDeleteHomeInvite } from "@/domains/home/hooks/useDeleteHomeInvite";
import { InviteModel } from "@/domains/home/home.types";

export default function HomeUsersCard({ homeId }: { homeId: string }) {
  const getHomeUsers = useGetHomeUsers();
  const removeUserFromHome = useRemoveUserFromHome();
  const getHomeInvite = useGetHomeInvite();
  const createHomeInvite = useCreateHomeInvite();
  const deleteHomeInvite = useDeleteHomeInvite();
  const [users, setUsers] = useState<UserModel[]>([]);
  const [dialogUser, setDialogUser] = useState<UserModel | null>(null);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteData, setInviteData] = useState<InviteModel[] | null>(null);
  const [expiryHours, setExpiryHours] = useState<number>();

  useEffect(() => {
    fetchUsers();
    fetchInvite();
  }, [homeId]);

  async function fetchUsers() {
    try {
      const fetchedUsers = await getHomeUsers(homeId);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }

  const handleRemoveUser = async (userId: string) => {
    try {
      await removeUserFromHome(homeId, userId);
      setDialogUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Failed to remove user from home", error);
    }
  };

  async function fetchInvite() {
    try {
      const data = await getHomeInvite(homeId);
      setInviteData(data);
      console.log("Invite data", data);
    } catch (error) {
      console.error("Failed to fetch invite:", error);
    }
  }

  async function handleCreateInvite() {
    try {
      const data = await createHomeInvite(homeId, expiryHours);
      setInviteData(data);
    } catch (error) {
      console.error("Failed to create invite:", error);
    }
  }

  async function handleDeleteInvite() {
    try {
      if (inviteData && inviteData[0]) {
        await deleteHomeInvite(homeId, inviteData[0].id);
        setInviteData(null);
      }
    } catch (error) {
      console.error("Failed to delete invite:", error);
    }
  }

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage your home users</CardDescription>
          </div>
          <Button
            variant="secondary"
            onClick={() => setIsInviteDialogOpen(true)}
          >
            Invite more people
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell className="text-center">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => {
                const isAdmin = user.admin || false;

                return (
                  <TableRow key={user.userId || index}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{isAdmin ? "Admin" : "User"}</TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label="More actions"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => console.log("Toggle admin status")}
                          >
                            {isAdmin ? "Make into User" : "Make into Admin"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDialogUser(user)}>
                            Remove from home
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog
        open={!!dialogUser}
        onOpenChange={(open) => !open && setDialogUser(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {dialogUser?.name} from your home. This will
              delete all their items as well.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDialogUser(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => dialogUser && handleRemoveUser(dialogUser.userId)}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={isInviteDialogOpen}
        onOpenChange={() => setIsInviteDialogOpen(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Home invite code</DialogTitle>
            <DialogDescription>
              Create an invite code for your home. This can be used to invite
              other users to join your home.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {inviteData && inviteData[0] ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Invite Code:</span>
                  <span
                    className={
                      inviteData[0].expiresAt &&
                      new Date(inviteData[0].expiresAt) < new Date()
                        ? "text-gray-500"
                        : ""
                    }
                  >
                    {inviteData[0].code}
                  </span>
                </div>
                {inviteData[0].expiresAt && (
                  <div className="text-sm text-gray-500">
                    Expires:{" "}
                    {new Date(inviteData[0].expiresAt).toLocaleString()}
                  </div>
                )}
                {inviteData[0].expiresAt &&
                  new Date(inviteData[0].expiresAt) < new Date() && (
                    <Button variant="destructive" onClick={handleDeleteInvite}>
                      Delete Expired Code
                    </Button>
                  )}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">No active invite code</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Expires in (hours)"
                    className="border rounded p-2 w-24"
                    min="1"
                    onChange={(e) => setExpiryHours(Number(e.target.value))}
                  />
                  <Button onClick={handleCreateInvite}>
                    Create Invite Code
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
