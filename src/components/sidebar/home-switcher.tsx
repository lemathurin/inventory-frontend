"use client";

import * as React from "react";
import { ChevronsUpDown, HouseIcon, Plus, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useHome } from "@/contexts/home.context";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { getInitials } from "@/lib/utils";

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
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { homeData } = useHome();

  if (!homeData) {
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
                {getInitials(homeData.name)}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{homeData.name}</span>
                <span className="truncate text-xs">{homeData.address}</span>
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
            {homes.map((home) => (
              <DropdownMenuItem
                key={home.homeId}
                className="gap-2 p-2"
                onClick={() => router.push(`/home/${home.homeId}`)}
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <HouseIcon />
                </div>
                {home.home.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => router.push(`/home/${homeData.id}/settings`)}
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
