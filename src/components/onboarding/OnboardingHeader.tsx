"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Check } from "lucide-react";
import { usePathname } from "next/navigation";

interface OnboardingHeaderProps {
  totalSteps: number;
  currentStep: number;
}

const BreadcrumbLabels = {
  start: "Getting started",
  join: "Join a home",
  create: "Create a home",
} as const;

export default function OnboardingHeader({
  totalSteps,
  currentStep,
}: OnboardingHeaderProps) {
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    const breadcrumbs = [];

    if (pathname.includes("/onboarding/start")) {
      breadcrumbs.push(BreadcrumbLabels.start);
    } else if (pathname.includes("/onboarding/create")) {
      breadcrumbs.push(BreadcrumbLabels.start);
      breadcrumbs.push(BreadcrumbLabels.create);
    } else if (pathname.includes("/onboarding/join")) {
      breadcrumbs.push(BreadcrumbLabels.start);
      breadcrumbs.push(BreadcrumbLabels.join);
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="w-full fixed p-8 flex justify-between gap-2.5 flex-wrap">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Home Inventory App</BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbs.map((label, index) => (
            <React.Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{label}</BreadcrumbPage>
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="inline-flex justify-start items-center gap-2.5 flex-wrap">
        {Array.from({ length: totalSteps - 1 }, (_, index) => (
          <div
            key={index}
            className={`w-6 h-6 rounded-[50px] outline outline-2 outline-offset-[-1px] outline-border ${
              index < currentStep ? "bg-accent outline-primary" : ""
            } inline-flex flex-col justify-center items-center overflow-hidden`}
          >
            <div
              className={`justify-start text-sm font-medium ${
                index < currentStep ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {index + 1}
            </div>
          </div>
        ))}
        <div
          className={`w-6 h-6 rounded-[50px] outline outline-2 outline-offset-[-1px] outline-border ${
            currentStep === totalSteps ? "bg-accent outline-primary" : ""
          } inline-flex flex-col justify-center items-center overflow-hidden`}
        >
          <Check
            className={`w-3.5 h-3.5 ${
              currentStep === totalSteps
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
