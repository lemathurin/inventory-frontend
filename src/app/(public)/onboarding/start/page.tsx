"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import Link from "next/link";

export default function StartOnboarding() {
  return (
    <>
      <OnboardingHeader currentStep={1} totalSteps={3} />
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Getting started
            </CardTitle>
            <CardDescription>
              Do you want to create a home from scratch or do you have an invite
              code to join an already existing home?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button variant="outline" asChild className="h-40 w-full">
                <Link href="/onboarding/create/step-1">Create a new home</Link>
              </Button>
              <Button variant="outline" asChild className="h-40 w-full">
                <Link href="/onboarding/join/step-1">
                  Join an existing home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
