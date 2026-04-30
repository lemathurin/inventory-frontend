import { NextRequest } from "next/server";
import { requireAuth, withAuthCookie } from "@/server/auth";
import { requireEntityAdmin } from "@/server/permissions";
import { json } from "@/server/response";
import * as homeModel from "@/server/models/home-model";

type Context = {
  params: {
    homeId: string;
    inviteId: string;
  };
};

export async function DELETE(request: NextRequest, context: Context) {
  const auth = await requireAuth(request);
  if ("status" in auth) {
    return auth;
  }

  try {
    const { homeId, inviteId } = context.params;
    const isAdmin = await requireEntityAdmin("home", homeId, auth.userId);

    if (!isAdmin) {
      return withAuthCookie(
        json({ error: "Admin access required for this home" }, { status: 403 }),
        auth,
      );
    }

    await homeModel.deleteHomeInvite(inviteId);

    return withAuthCookie(
      json({ message: "Invite deleted successfully" }, { status: 200 }),
      auth,
    );
  } catch (error) {
    console.error("Error deleting invite:", error);
    return withAuthCookie(
      json(
        {
          error: "Failed to delete invite",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      ),
      auth,
    );
  }
}
