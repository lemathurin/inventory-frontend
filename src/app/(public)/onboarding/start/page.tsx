"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import OnboardingHeader from "@/components/onboarding/onboarding-header";

export default function StartOnboarding() {
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    undefined
  );

  function handleSubmit() {
    if (selectedValue === "create") {
      router.push(`/onboarding/create/step-1`);
    } else if (selectedValue === "join") {
      router.push(`/onboarding/join`);
    } else {
      console.warn("No option selected");
    }
  }
  return (
    <>
      <OnboardingHeader currentStep={1} totalSteps={3} />
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Welcome to Home Inventory!
            </CardTitle>
            <CardDescription>
              Do you want to create a home from scratch or do you have an invite
              code to join an already existing home?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={selectedValue}
              onValueChange={setSelectedValue}
              className="grid grid-cols-2 gap-4"
            >
              <div className="relative">
                <RadioGroupItem
                  value="create"
                  id="create"
                  className="absolute top-4 left-4 peer"
                />
                <Label
                  htmlFor="create"
                  className="flex flex-col h-40 items-center justify-center rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Create a new home
                </Label>
              </div>
              <div className="relative">
                <RadioGroupItem
                  value="join"
                  id="join"
                  className="absolute top-4 left-4 peer"
                />
                <Label
                  htmlFor="join"
                  className="flex flex-col h-40 items-center justify-center rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Join an existing home
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={!selectedValue}
            >
              Continue
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
