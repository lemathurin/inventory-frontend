"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useParams } from "next/navigation";

export function HomeSwitcher({
  homes,
}: {
  homes: {
    homeId: string;
    home: {
      name: string;
      address: string;
    };
  }[];
}) {
  const { isMobile } = useSidebar();
  const { homeId } = useParams();
  const router = useRouter();

  // Find the active home based on homeId
  const activeHome = homes.find((home) => home.homeId === homeId) || homes[0];

  if (!activeHome) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {/* <activeHome.logo className="size-4" /> */}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeHome.home.name}
                </span>
                <span className="truncate text-xs">
                  {activeHome.home.address}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Homes
            </DropdownMenuLabel>
            {homes.map((home, index) => (
              <DropdownMenuItem
                key={home.homeId}
                className="gap-2 p-2"
                onClick={() => router.push(`/home/${home.homeId}`)}
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  {/* <home.logo className="size-4 shrink-0" /> */}
                </div>
                {home.home.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => router.push(`/home/${activeHome.homeId}/settings`)}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Settings className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Manage this home
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Join or create a home
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
