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
              <TableCell className="text-center">Actions</TableCell>
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
                  <TableCell></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
