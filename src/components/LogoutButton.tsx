"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    router.push("/login");
  };

  return (
    <Button
      onClick={handleLogout}
      className="absolute top-4 right-4 p-2"
      // variant="ghost"
      size="icon"
      aria-label="Logout"
    >
      <LogOut className="h-5 w-5" />
    </Button>
  );
}
