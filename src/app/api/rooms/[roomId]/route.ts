import { NextRequest } from "next/server";
import { requireAuth, withAuthCookie } from "@/server/auth";
import { requireEntityAdmin } from "@/server/permissions";
import { json } from "@/server/response";
import { getSanitizedBody } from "@/server/sanitize";
import * as roomModel from "@/server/models/room-model";

type Context = {
  params: {
    roomId: string;
  };
};

export async function GET(request: NextRequest, context: Context) {
  const auth = await requireAuth(request);
  if ("status" in auth) {
    return auth;
  }

  try {
    const { roomId } = context.params;
    const room = await roomModel.getRoomDetails(roomId);

    if (!room) {
      return withAuthCookie(json({ error: "Room not found" }, { status: 404 }), auth);
    }

    return withAuthCookie(json(room, { status: 200 }), auth);
  } catch (error) {
    return withAuthCookie(
      json(
        {
          error: "Failed to get room details",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      ),
      auth,
    );
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  const auth = await requireAuth(request);
  if ("status" in auth) {
    return auth;
  }

  try {
    const { roomId } = context.params;
    const isAdmin = await requireEntityAdmin("room", roomId, auth.userId);

    if (!isAdmin) {
      return withAuthCookie(
        json({ error: "Admin access required for this room" }, { status: 403 }),
        auth,
      );
    }

    const { name } = await getSanitizedBody<{ name: string }>(request);

    if (!name) {
      return withAuthCookie(
        json({ error: "Room name is required" }, { status: 400 }),
        auth,
      );
    }

    const updatedRoom = await roomModel.updateRoomName(roomId, name);
    return withAuthCookie(
      json(
        {
          message: "Room name updated successfully",
          room: updatedRoom,
        },
        { status: 200 },
      ),
      auth,
    );
  } catch (error) {
    console.error("Error updating room:", error);
    return withAuthCookie(
      json(
        {
          error: "Failed to update room name",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      ),
      auth,
    );
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  const auth = await requireAuth(request);
  if ("status" in auth) {
    return auth;
  }

  try {
    const { roomId } = context.params;
    const isAdmin = await requireEntityAdmin("room", roomId, auth.userId);

    if (!isAdmin) {
      return withAuthCookie(
        json({ error: "Admin access required for this room" }, { status: 403 }),
        auth,
      );
    }

    const room = await roomModel.getRoomDetails(roomId);
    if (!room) {
      return withAuthCookie(json({ error: "Room not found" }, { status: 404 }), auth);
    }
    if (room.items && room.items.length > 0) {
      return withAuthCookie(
        json({ error: "Cannot delete room with items" }, { status: 400 }),
        auth,
      );
    }

    await roomModel.deleteRoomById(roomId);
    return withAuthCookie(
      json({ message: "Room deleted successfully" }, { status: 200 }),
      auth,
    );
  } catch (error) {
    console.error("Error deleting room:", error);
    return withAuthCookie(
      json(
        {
          error: "Failed to delete room",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      ),
      auth,
    );
  }
}
