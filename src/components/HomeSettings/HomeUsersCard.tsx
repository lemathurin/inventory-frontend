"use client";

import { useState, useEffect } from "react";
import { CircleX, Copy, Delete, MoreHorizontal } from "lucide-react";
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
import { Input } from "../ui/input";
import { Label } from "../ui/label";

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
      setExpiryHours(0);
      await fetchInvite();
    } catch (error) {
      console.error("Failed to create invite:", error);
    }
  }

  async function handleDeleteInvite() {
    try {
      if (inviteData && inviteData[0]) {
        await deleteHomeInvite(homeId, inviteData[0].id);
        await fetchInvite();
      }
    } catch (error) {
      console.error("Failed to delete invite:", error);
    }
  }

  function isExpired(invite: InviteModel): boolean {
    return invite.expiresAt ? new Date(invite.expiresAt) < new Date() : false;
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
          <div>
            {inviteData && inviteData[0] ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div
                        className={`text-lg font-semibold ${isExpired(inviteData[0]) ? "text-muted-foreground" : ""}`}
                      >
                        {inviteData[0].code}
                        {isExpired(inviteData[0]) && (
                          <span className="ml-2 text-sm text-destructive">
                            (Expired)
                          </span>
                        )}
                      </div>
                      {inviteData[0].expiresAt && (
                        <div
                          className={`text-sm ${isExpired(inviteData[0]) ? "text-destructive" : "text-muted-foreground"}`}
                        >
                          Expires:{" "}
                          {new Date(inviteData[0].expiresAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          navigator.clipboard.writeText(inviteData[0].code)
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={handleDeleteInvite}
                      >
                        <CircleX className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6 flex flex-col gap-3">
                  <div className="font-medium">Create invite code</div>
                  <div className="flex w-full items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      placeholder="Expires in (hours)"
                      onChange={(e) => {
                        setExpiryHours(Number(e.target.value));
                      }}
                    />
                    <Button onClick={handleCreateInvite}>Create</Button>
                  </div>
                  <Label>Leave blank for no expiration.</Label>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
