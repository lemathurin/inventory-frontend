"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useCreateRoom } from "@/domains/room/hooks/useCreateRoom";
import { useRouter } from "next/navigation";

export default function OnboardingCreateStep2() {
  const router = useRouter();
  const createRoom = useCreateRoom();
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

  async function handleFinish() {
    const homeId = sessionStorage.getItem("homeId");
    if (homeId) {
      try {
        await Promise.all(rooms.map((room) => createRoom(homeId, room)));
        sessionStorage.removeItem("homeId");
        router.push(`/home/${homeId}`);
      } catch (err) {
        console.error("Failed to create one or more rooms:", err);
      }
    } else {
      console.error("Home ID is missing, cannot finish onboarding.");
      router.back();
    }
  }

  return (
    <>
      <OnboardingHeader currentStep={3} totalSteps={3} />
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Rooms</CardTitle>
            <CardDescription>Add your home&apos;s rooms</CardDescription>
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
