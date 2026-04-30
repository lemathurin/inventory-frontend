import { NextRequest } from "next/server";
import { requireAuth, withAuthCookie } from "@/server/auth";
import { requireEntityAdmin } from "@/server/permissions";
import { json } from "@/server/response";
import { getSanitizedBody } from "@/server/sanitize";
import * as homeModel from "@/server/models/home-model";

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
    const isAdmin = await requireEntityAdmin("home", homeId, auth.userId);

    if (!isAdmin) {
      return withAuthCookie(
        json({ error: "Admin access required for this home" }, { status: 403 }),
        auth,
      );
    }

    const { expiresInHours } = await getSanitizedBody<{ expiresInHours?: number }>(
      request,
    );

    const expiresAt = expiresInHours
      ? new Date(Date.now() + expiresInHours * 60 * 60 * 1000)
      : undefined;

    const invite = await homeModel.createHomeInvite(homeId, auth.userId, expiresAt);

    return withAuthCookie(
      json(
        {
          message: "Invite created successfully",
          invite: {
            code: invite.code,
            expiresAt: invite.expiresAt,
          },
        },
        { status: 201 },
      ),
      auth,
    );
  } catch (error) {
    console.error("Error creating invite:", error);
    return withAuthCookie(
      json(
        {
          error: "Failed to create invite",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      ),
      auth,
    );
  }
}

export async function GET(request: NextRequest, context: Context) {
  const auth = await requireAuth(request);
  if ("status" in auth) {
    return auth;
  }

  try {
    const { homeId } = context.params;
    const isAdmin = await requireEntityAdmin("home", homeId, auth.userId);

    if (!isAdmin) {
      return withAuthCookie(
        json({ error: "Admin access required for this home" }, { status: 403 }),
        auth,
      );
    }

    const home = await homeModel.findHomeById(homeId);
    if (!home) {
      return withAuthCookie(json({ error: "Home not found" }, { status: 404 }), auth);
    }

    const invites = await homeModel.findHomeInvites(homeId);
    return withAuthCookie(json(invites, { status: 200 }), auth);
  } catch (error) {
    console.error("Error fetching invites:", error);
    return withAuthCookie(
      json(
        {
          error: "Failed to fetch invites",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      ),
      auth,
    );
  }
}
