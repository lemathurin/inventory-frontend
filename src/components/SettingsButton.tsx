"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default function SettingsButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        router.push("/account/settings");
      }}
      className="absolute top-4 right-16 p-2"
      // variant="ghost"
      size="icon"
      aria-label="Settings"
    >
      <Settings className="h-5 w-5" />
    </Button>
  );
}
