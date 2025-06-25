"use client";

import { useState } from "react";
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
import { DeleteAccountModal } from "@/components/delete-account-modal";
import { useUser } from "@/domains/user/user.context";
import { useUpdateUserName } from "@/domains/user/hooks/useUpdateUserName";
import { useUpdateUserEmail } from "@/domains/user/hooks/useUpdateUserEmail";
import { useUpdateUserPassword } from "@/domains/user/hooks/useUpdateUserPassword";
import { useDeleteUser } from "@/domains/user/hooks/useDeleteUser";
import { AppHeader } from "@/components/AppHeader";

export default function AccountSettings() {
  const { userData } = useUser();
  const updateUserName = useUpdateUserName();
  const updateUserEmail = useUpdateUserEmail();
  const updateUserPassword = useUpdateUserPassword();
  const deleteUser = useDeleteUser();
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!userData) {
    return null;
  }

  function togglePasswordVisibility() {
    setShowPasswords(!showPasswords);
  }

  async function handleChangeName(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (newName === userData?.name || !newName.trim()) {
        toast.error("Please enter a new name");
        return;
      }

      await updateUserName(newName);
      toast.success(`Your name has been changed to ${newName}`);
      setNewName("");
    } catch (error) {
      console.error("Error changing name:", error);
      toast.error("An error occurred while changing your name");
    }
  }

  async function handleChangeEmail(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (newEmail === userData?.email || !newEmail.trim()) {
        toast.error("Please enter a new email");
        return;
      }

      await updateUserEmail(newEmail);
      toast.success(`Your email has been changed to ${newEmail}`);
      setNewEmail("");
    } catch (error) {
      console.error("Error changing email:", error);
      toast.error("An error occurred while changing your email");
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (newPassword !== confirmPassword) {
        toast.error("New passwords don't match");
        return;
      }

      if (!currentPassword || !newPassword || !confirmPassword) {
        toast.error("Please fill in all password fields");
        return;
      }

      await updateUserPassword(currentPassword, newPassword);
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("An error occurred while changing your password");
    }
  }

  async function handleDeleteAccount(password: string) {
    try {
      await deleteUser(password);
      toast.success("Account deleted successfully");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("An error occurred while deleting your account");
    }
  }

  return (
    <>
      <AppHeader
        breadcrumbs={[{ label: "Account settings", isCurrent: true }]}
      />
      <div className="min-h-screen p-4">
        <Toaster richColors position="bottom-right" />
        <Card className="mb-4">
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
                disabled={newName === userData?.name || !newName.trim()}
              >
                Save Name
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mb-4">
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
                  placeholder={userData?.email}
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={newEmail === userData?.email || !newEmail.trim()}
              >
                Save Email
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Change Password</CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showPasswords ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={togglePasswordVisibility}
                    aria-label={
                      showPasswords ? "Hide password" : "Show password"
                    }
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
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={togglePasswordVisibility}
                    aria-label={
                      showPasswords ? "Hide password" : "Show password"
                    }
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={togglePasswordVisibility}
                    aria-label={
                      showPasswords ? "Hide password" : "Show password"
                    }
                  >
                    {showPasswords ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword ||
                  newPassword !== confirmPassword
                }
              >
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
            <Button
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete Account
            </Button>
          </CardFooter>
        </Card>

        <DeleteAccountModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteAccount}
        />
      </div>
    </>
  );
}
