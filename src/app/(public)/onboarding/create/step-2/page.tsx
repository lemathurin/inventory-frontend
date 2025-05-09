"use client";

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
import OnboardingHeader from "@/components/onboarding/onboarding-header";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OnboardingCreateStep2() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState<string[]>([]);

  function handleAddRoom() {
    if (roomName.trim() !== "") {
      setRooms([...rooms, roomName.trim()]);
      setRoomName("");
    }
  }

  function handleRemoveRoom(indexToRemove: number) {
    setRooms(rooms.filter((_, index) => index !== indexToRemove));
  }

  function handleFinish() {
    const homeId = searchParams.get("homeId");
    if (homeId) {
      router.push(`/home/${homeId}`);
    } else {
      console.error("Home ID is missing, cannot finish onboarding.");
    }
  }

  return (
    <>
      <OnboardingHeader currentStep={3} totalSteps={3} />
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Rooms</CardTitle>
            <CardDescription>Add your home's rooms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Living room"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddRoom();
                  }
                }}
              />
              <Button type="button" onClick={handleAddRoom}>
                Add
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {rooms.map((room, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {room}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 rounded-full"
                    onClick={() => handleRemoveRoom(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleFinish}>
              Finish
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
