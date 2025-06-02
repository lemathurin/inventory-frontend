"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LogOut,
  Settings,
  PanelLeftClose,
  PanelLeft,
  Moon,
  Sun,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useUser } from "@/contexts/user.context";
import { useTheme } from "next-themes";

export default function ClientLogoutButton() {
  const pathname = usePathname();
  const router = useRouter();
  const hideOnPaths = ["/", "/login", "/signup"];
  const { toggleSidebar, state } = useSidebar();
  const { userData } = useUser();
  const { setTheme } = useTheme();

  if (hideOnPaths.includes(pathname)) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 flex gap-2 z-50">
      <Button>
        {userData && `User: ${userData.name} (ID: ${userData.id})`}
      </Button>
      <Button onClick={toggleSidebar} size="icon" aria-label="Toggle Sidebar">
        {state === "expanded" ? (
          <PanelLeftClose className="h-5 w-5" />
        ) : (
          <PanelLeft className="h-5 w-5" />
        )}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
