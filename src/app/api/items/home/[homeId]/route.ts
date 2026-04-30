import { NextRequest } from "next/server";
import { requireAuth, withAuthCookie } from "@/server/auth";
import { json } from "@/server/response";
import * as itemModel from "@/server/models/item-model";

type Context = {
  params: {
    homeId: string;
  };
};

export async function GET(request: NextRequest, context: Context) {
  const auth = await requireAuth(request);
  if ("status" in auth) {
    return auth;
  }

  try {
    const { homeId } = context.params;
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit");
    const orderBy = searchParams.get("orderBy");
    const orderDirection = searchParams.get("orderDirection");

    const home = await itemModel.findUserHomeById(homeId, auth.userId);
    if (!home) {
      return withAuthCookie(
        json(
          {
            error: "Home not found or you do not have permission to access it",
          },
          { status: 404 },
        ),
        auth,
      );
    }

    const rawItems = await itemModel.findItemsByHomeIdForUserAndPublic(
      homeId,
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
    console.error("Error fetching items:", error);
    return withAuthCookie(json({ error: "Could not fetch items" }, { status: 500 }), auth);
  }
}
