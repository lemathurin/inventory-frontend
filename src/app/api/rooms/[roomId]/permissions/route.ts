import { NextRequest } from "next/server";
import { requireAuth, withAuthCookie } from "@/server/auth";
import { json } from "@/server/response";
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
    const membership = await roomModel.findUserRoomMembership(auth.userId, roomId);

    if (!membership) {
      return withAuthCookie(
        json({ error: "User is not a member of this room" }, { status: 404 }),
        auth,
      );
    }

    return withAuthCookie(json({ admin: membership.admin }, { status: 200 }), auth);
  } catch (error) {
    console.error("Error fetching room permissions:", error);
    return withAuthCookie(
      json(
        {
          error: "Failed to fetch room permissions",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      ),
      auth,
    );
  }
}
