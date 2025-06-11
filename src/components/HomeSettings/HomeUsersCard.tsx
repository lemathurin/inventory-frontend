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
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>Manage your home users</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              {/* <TableCell></TableCell> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => {
              const isAdmin = user.admin || false;

              return (
                <TableRow key={user.id || index}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{isAdmin ? "Admin" : "User"}</TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => console.log("Toggle admin status")}
                        >
                          {isAdmin ? "Make into User" : "Make into Admin"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => console.log("Remove from home")}
                        >
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
  );
}
