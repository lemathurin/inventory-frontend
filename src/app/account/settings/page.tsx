"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function AccountSettings() {
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isLoadingName, setIsLoadingName] = useState(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [showPasswords, setShowPasswords] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPasswords(!showPasswords);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.json();
      setUserData(userData);
      setNewName(userData.name);
      setNewEmail(userData.email);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setIsLoadingUserData(false);
    }
  };

  const handleChangeName = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingName(true);
    try {
      console.log("Sending request with newName:", newName);
      const response = await fetch(
        "http://localhost:3000/api/users/change-name",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ newName }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error(`Failed to change name: ${response.statusText}`);
      }

      const updatedUser = await response.json();
      toast.success(`Your name has been changed to ${updatedUser.name}`);

      setUserData((prevData) => ({ ...prevData, name: updatedUser.name }));
      setNewName(updatedUser.name);
    } catch (error) {
      console.error("Error changing name:", error);
      toast.error("An error occurred while changing your name");
    } finally {
      setIsLoadingName(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingEmail(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/users/change-email",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ newEmail }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to change email");
      }
      const updatedUser = await response.json();
      toast.success(`Your email has been changed to ${updatedUser.email}`);

      setUserData((prevData) => ({ ...prevData, email: updatedUser.email }));
      setNewEmail(updatedUser.email);
    } catch (error: any) {
      console.error("Error changing email:", error);
      toast.error(
        error.message || "An error occurred while changing your email"
      );
    } finally {
      setIsLoadingEmail(false);
    }
  };

  // if (isLoadingUserData) {
  //   return <div>Loading user data...</div>;
  // }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Toaster position="top-center" />
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      <Card className="mb-8">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Change Name</CardTitle>
          <CardDescription>Update your account name</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangeName} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder={userData.name}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={
                isLoadingName || newName === userData.name || newName === ""
              }
            >
              {isLoadingName ? "Saving..." : "Save Name"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Change Email</CardTitle>
          <CardDescription>Update your account email</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangeEmail} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder={userData.email}
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>
            <Button
              className="w-full sm:w-auto"
              disabled={
                isLoadingEmail || newEmail === userData.email || newEmail === ""
              }
            >
              Save Email
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPasswords ? "text" : "password"}
                  placeholder="Enter your current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                  aria-label={showPasswords ? "Hide password" : "Show password"}
                >
                  {showPasswords ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPasswords ? "text" : "password"}
                  placeholder="Enter your new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                  aria-label={showPasswords ? "Hide password" : "Show password"}
                >
                  {showPasswords ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showPasswords ? "text" : "password"}
                  placeholder="Confirm your new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                  aria-label={showPasswords ? "Hide password" : "Show password"}
                >
                  {showPasswords ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full sm:w-auto">
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Delete Account</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Warning: This action cannot be undone. Please be certain.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" className="w-full sm:w-auto">
            Delete Account
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
