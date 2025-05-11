"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCreateHome } from "@/domains/home/hooks/useCreateHome";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";

const schema = z.object({
  name: z.string().min(1, { message: "Home name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
});

type FormData = z.infer<typeof schema>;

export default function OnboardingCreateStep1() {
  const router = useRouter();
  const { createNewHome, isLoading, error } = useCreateHome();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    try {
      const response = await createNewHome(data.name, data.address);
      if (response?.home?.id) {
        // router.push(`/home/${response.home.id}`);
        router.push(`/onboarding/create/step-2?homeId=${response.home.id}`);
      }
    } catch (err) {
      console.error("Home creation error:", err);
    }
  }

  return (
    <>
      <OnboardingHeader currentStep={2} totalSteps={3} />
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Welcome!</CardTitle>
            <CardDescription>Let&#39;s set up your new home</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="home-name">Home Name</Label>
                <Input
                  id="home-name"
                  type="text"
                  placeholder="Name your home"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter your address"
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-sm text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Home..." : "Create Home"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
