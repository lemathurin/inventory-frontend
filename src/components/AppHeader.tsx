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

interface BreadcrumbItemProps {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

interface AppHeaderProps {
  breadcrumbs?: BreadcrumbItemProps[];
  actionButton?: React.ReactNode;
}

export function AppHeader({ breadcrumbs = [], actionButton }: AppHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
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
      {actionButton && <div className="ml-auto">{actionButton}</div>}
    </header>
  );
}
