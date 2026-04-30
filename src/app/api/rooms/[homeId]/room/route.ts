import { NextRequest } from "next/server";
import { requireAuth, withAuthCookie } from "@/server/auth";
import { json } from "@/server/response";
import { getSanitizedBody } from "@/server/sanitize";
import { prisma } from "@/server/prisma";
import * as roomModel from "@/server/models/room-model";

type Context = {
  params: {
    homeId: string;
  };
};

export async function POST(request: NextRequest, context: Context) {
  const auth = await requireAuth(request);
  if ("status" in auth) {
    return auth;
  }

  try {
    const { homeId } = context.params;
    const { name } = await getSanitizedBody<{ name: string }>(request);

    if (!name) {
      return withAuthCookie(
        json({ error: "Room name is required" }, { status: 400 }),
        auth,
      );
    }

    const home = await prisma.home.findUnique({ where: { id: homeId } });
    if (!home) {
      return withAuthCookie(json({ error: "Home not found" }, { status: 404 }), auth);
    }

    const newRoom = await roomModel.createRoom(homeId, name, auth.userId);
    return withAuthCookie(json(newRoom, { status: 201 }), auth);
  } catch (error) {
    console.error("Error creating room:", error);
    return withAuthCookie(
      json(
        {
          error: "Failed to create room",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      ),
      auth,
    );
  }
}
