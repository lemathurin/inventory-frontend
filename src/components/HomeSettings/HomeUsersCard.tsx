"use client";

import { useState } from "react";
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
import { useRemoveUserFromHome } from "@/domains/home/hooks/useRemoveUserFromHome";

interface HomeUsersCardProps {
  homeId: string;
  users: UserModel[];
  onUsersUpdated: (users: UserModel[]) => void;
}

export default function HomeUsersCard({
  homeId,
  users,
  onUsersUpdated,
}: HomeUsersCardProps) {
  const removeUserFromHome = useRemoveUserFromHome();
  const [dialogUser, setDialogUser] = useState<UserModel | null>(null);

  const handleRemoveUser = async (userId: string) => {
    try {
      await removeUserFromHome(homeId, userId);
      setDialogUser(null);
    } catch (error) {
      console.error("Failed to remove user from home", error);
    }
  };

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage your home users</CardDescription>
          </div>
          <Button variant="secondary">Invite more people</Button>
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

      {/* AlertDialog rendered once outside the table */}
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
              onClick={() => dialogUser && handleRemoveUser(dialogUser.id)}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
