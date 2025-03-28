"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, PanelLeftClose, PanelLeft } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useGetCurrentUser } from "@/domains/user/hooks/useGetCurrentUser";
import { useLogout } from "@/domains/user/hooks/useLogout";

export default function ClientLogoutButton() {
  const pathname = usePathname();
  const router = useRouter();
  const hideOnPaths = ["/", "/login", "/signup"];
  const { toggleSidebar, state } = useSidebar();
  const { user } = useGetCurrentUser();
  const { logout } = useLogout();

  if (hideOnPaths.includes(pathname)) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 flex gap-2">
      <Button>{user && `User: ${user.name} (ID: ${user.id})`}</Button>
      <Button onClick={toggleSidebar} size="icon" aria-label="Toggle Sidebar">
        {state === "expanded" ? (
          <PanelLeftClose className="h-5 w-5" />
        ) : (
          <PanelLeft className="h-5 w-5" />
        )}
      </Button>
      {/* <Button
        onClick={() => router.push("/account/settings")}
        size="icon"
        aria-label="Settings"
      >
        <Settings className="h-5 w-5" />
      </Button> */}
      {/* <Button onClick={logout} size="icon" aria-label="Logout">
        <LogOut className="h-5 w-5" />
      </Button> */}
    </div>
  );
}
