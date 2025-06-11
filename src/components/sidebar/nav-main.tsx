"use client";

import {
  ChevronRight,
  CirclePlus,
  FileText,
  LayoutDashboard,
  Shapes,
  Square,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useHome } from "@/domains/home/home.context";
import Link from "next/link";

export function NavMain() {
  const { homeData } = useHome();

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={`/home/${homeData?.id}`}>
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Collapsible className="group/collapsible">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <Square />
                    <span>Rooms</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {homeData?.rooms?.map((room) => (
                      <SidebarMenuSubItem key={room.id}>
                        <SidebarMenuSubButton asChild>
                          <Link href={`#${room.id}`}>
                            <span>{room.name}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Collapsible className="group/collapsible">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <Shapes />
                    <span>Items</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href={`/home/${homeData?.id}/create-item`}>
                          <CirclePlus />
                          <span>Create Item</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#">
                  <FileText />
                  <span>Warranties</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
