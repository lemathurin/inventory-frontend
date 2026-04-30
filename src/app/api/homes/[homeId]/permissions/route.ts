import { NextRequest } from "next/server";
import { requireAuth, withAuthCookie } from "@/server/auth";
import { json } from "@/server/response";
import * as homeModel from "@/server/models/home-model";

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
    const membership = await homeModel.findUserHomeMembership(auth.userId, homeId);

    if (!membership) {
      return withAuthCookie(
        json({ error: "User is not a member of this home" }, { status: 404 }),
        auth,
      );
    }

    return withAuthCookie(json({ admin: membership.admin }, { status: 200 }), auth);
  } catch (error) {
    console.error("Error fetching home permissions:", error);
    return withAuthCookie(
      json(
        {
          error: "Failed to fetch home permissions",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      ),
      auth,
    );
  }
}
