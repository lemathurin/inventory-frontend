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
    const room = await roomModel.getRoomUsers(roomId);

    if (!room) {
      return withAuthCookie(json({ error: "Room not found" }, { status: 404 }), auth);
    }

    const users = room.users.map((userRoom) => ({
      ...userRoom.user,
      isAdmin: userRoom.admin,
    }));

    return withAuthCookie(json(users, { status: 200 }), auth);
  } catch (error) {
    console.error("Error fetching room users:", error);
    return withAuthCookie(
      json(
        {
          error: "Failed to fetch room users",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      ),
      auth,
    );
  }
}

export async function POST(request: NextRequest, context: Context) {
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

    const { userId } = await getSanitizedBody<{ userId: string }>(request);

    if (!userId) {
      return withAuthCookie(
        json({ error: "User ID is required" }, { status: 400 }),
        auth,
      );
    }

    const room = await roomModel.getRoomDetails(roomId);
    if (!room) {
      return withAuthCookie(json({ error: "Room not found" }, { status: 404 }), auth);
    }

    const existingUser = room.users.find((userRoom) => userRoom.user.id === userId);
    if (existingUser) {
      return withAuthCookie(
        json({ error: "User is already in the room" }, { status: 400 }),
        auth,
      );
    }

    const updatedRoom = await roomModel.addUserToRoom(roomId, userId);
    return withAuthCookie(json(updatedRoom, { status: 200 }), auth);
  } catch (error) {
    console.error("Error adding user to room:", error);
    return withAuthCookie(
      json(
        {
          error: "Failed to add user to room",
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

    const { userId } = await getSanitizedBody<{ userId: string }>(request);
    const room = await roomModel.getRoomDetails(roomId);

    if (!room) {
      return withAuthCookie(json({ error: "Room not found" }, { status: 404 }), auth);
    }

    const userInRoom = room.users.find((userRoom) => userRoom.user.id === userId);
    if (!userInRoom) {
      return withAuthCookie(
        json({ error: "User is not in the room" }, { status: 400 }),
        auth,
      );
    }

    await roomModel.removeUserFromRoom(roomId, userId);

    return withAuthCookie(
      json({ message: "User removed from room successfully" }, { status: 200 }),
      auth,
    );
  } catch (error) {
    console.error("Error removing user from room:", error);
    return withAuthCookie(
      json(
        {
          error: "Failed to remove user from room",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      ),
      auth,
    );
  }
}
