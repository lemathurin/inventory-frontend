"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Home as HomeIcon } from "lucide-react";
import Link from "next/link";
import { apiUrl } from "@/config/api";

interface Home {
  id: string;
  name: string;
}

export default function HomeSelectorPage() {
  const [homes, setHomes] = useState<Home[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(apiUrl("/homes/user-homes"), {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch homes");
        }
        const data = await response.json();
        setHomes(data);
      } catch (err) {
        setError("Error fetching homes. Please try again later.");
        console.error("Error fetching homes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomes();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Choose a Home</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homes.map((home) => (
            <Card key={home.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HomeIcon className="h-5 w-5" />
                  {home.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow"></CardContent>
              <CardFooter>
                <Link href={`/home/${home.id}`} passHref className="w-full">
                  <Button className="w-full">Open</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
          <Card className="flex flex-col items-center justify-center">
            {/* Temporary */}
            <Link href="/onboarding" className="w-full h-full">
              <Button variant="outline" className="h-full w-full p-8">
                Add new home
              </Button>
            </Link>
          </Card>
        </div>
      </main>
    </div>
  );
}
