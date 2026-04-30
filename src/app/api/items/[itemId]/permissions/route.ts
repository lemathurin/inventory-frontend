import { NextRequest } from "next/server";
import { requireAuth, withAuthCookie } from "@/server/auth";
import { json } from "@/server/response";
import * as itemModel from "@/server/models/item-model";

type Context = {
  params: {
    itemId: string;
  };
};

export async function GET(request: NextRequest, context: Context) {
  const auth = await requireAuth(request);
  if ("status" in auth) {
    return auth;
  }

  try {
    const { itemId } = context.params;
    const membership = await itemModel.findUserItemMembership(auth.userId, itemId);

    if (!membership) {
      return withAuthCookie(
        json({ error: "User is not a member of this item" }, { status: 404 }),
        auth,
      );
    }

    return withAuthCookie(json({ admin: membership.admin }, { status: 200 }), auth);
  } catch (error) {
    console.error("Error fetching item permissions:", error);
    return withAuthCookie(
      json(
        {
          error: "Failed to fetch item permissions",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      ),
      auth,
    );
  }
}
