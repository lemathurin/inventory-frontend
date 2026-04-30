import { NextRequest } from "next/server";
import { requireAuth, withAuthCookie } from "@/server/auth";
import { json } from "@/server/response";
import * as itemModel from "@/server/models/item-model";

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
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit");
    const orderBy = searchParams.get("orderBy");
    const orderDirection = searchParams.get("orderDirection");

    const room = await itemModel.findUserRoomById(roomId, auth.userId);
    if (!room) {
      return withAuthCookie(
        json(
          {
            error: "Room not found or you do not have permission to access it",
          },
          { status: 404 },
        ),
        auth,
      );
    }

    const rawItems = await itemModel.findItemsByRoomIdForUserAndPublic(
      roomId,
      auth.userId,
      {
        limit: limit ? Number(limit) : undefined,
        orderBy:
          orderBy === "createdAt" || orderBy === "name" || orderBy === "price"
            ? orderBy
            : undefined,
        orderDirection:
          orderDirection === "asc" || orderDirection === "desc"
            ? orderDirection
            : undefined,
      },
    );

    const items = rawItems.map((item) => ({
      ...item,
      owner: item.users[0]?.user || null,
    }));

    return withAuthCookie(json(items, { status: 200 }), auth);
  } catch (error) {
    console.error("Error fetching room items:", error);
    return withAuthCookie(json({ error: "Could not fetch items" }, { status: 500 }), auth);
  }
}
