"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
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
import { apiUrl } from "@/config/api";

const schema = z.object({
  name: z.string().min(1, { message: "Home name is required" }),
});

type FormData = z.infer<typeof schema>;

export default function Onboarding() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      console.log("Token:", token);
      console.log("UserId:", userId);

      if (!token) {
        setError("You are not authenticated. Please log in.");
        router.push("/login");
        return;
      }

      const response = await axios.post(
        apiUrl(`/homes/create-home`),
        { ...data, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Response:", response.data);

      // Check if the response contains the home object with an id
      if (response.data.home && response.data.home.id) {
        const newHomeId = response.data.home.id;
        // Store the new home id in localStorage if needed
        localStorage.setItem("currentHomeId", newHomeId);
        // Redirect to the new home page
        router.push(`/home/${newHomeId}`);
      } else {
        setError("Home created but no ID returned. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError("Authentication failed. Please log in again.");
        router.push("/login");
      } else {
        setError("An error occurred while creating your home");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome!</CardTitle>
          <CardDescription>Let's set up your home</CardDescription>
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
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Create Home
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
