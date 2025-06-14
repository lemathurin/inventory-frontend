"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getInitials } from "@/lib/utils";

interface BreadcrumbItemProps {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

interface RoomUserProps {
  id: string;
  isAdmin: boolean;
  name: string;
}

interface AppHeaderProps {
  breadcrumbs?: BreadcrumbItemProps[];
  actionButton?: React.ReactNode;
  roomUsers?: RoomUserProps[] | null;
}

export function AppHeader({
  breadcrumbs = [],
  actionButton,
  roomUsers,
}: AppHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background text-card-foreground">
      <SidebarTrigger className="-ml-1" />
      {breadcrumbs.length > 0 && (
        <>
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => (
                <React.Fragment key={`breadcrumb-${index}`}>
                  <BreadcrumbItem key={`item-${index}`}>
                    {breadcrumb.href ? (
                      <BreadcrumbLink href={breadcrumb.href}>
                        {breadcrumb.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && (
                    <BreadcrumbSeparator key={`sep-${index}`} />
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </>
      )}
      <div className="flex-1" />
      {roomUsers && (
        <div className="flex ml-[9px]">
          {roomUsers.map((user) => (
            <Tooltip key={user.id}>
              <TooltipTrigger asChild>
                <Avatar
                  tabIndex={0}
                  className="ml-[-9px] border-background border-[3px] rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <AvatarFallback className="rounded-lg">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{user.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      )}
      {actionButton && (
        <div className="ml-2" tabIndex={0}>
          {actionButton}
        </div>
      )}
    </header>
  );
}
