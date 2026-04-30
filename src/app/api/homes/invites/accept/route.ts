import { NextRequest } from "next/server";
import { requireAuth, withAuthCookie } from "@/server/auth";
import { json } from "@/server/response";
import { getSanitizedBody } from "@/server/sanitize";
import { validateInviteCode } from "@/server/utils/invite-codes";
import * as homeModel from "@/server/models/home-model";

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if ("status" in auth) {
    return auth;
  }

  try {
    const { code } = await getSanitizedBody<{ code: string }>(request);

    if (!validateInviteCode(code)) {
      return withAuthCookie(
        json({ error: "Invalid invite code format" }, { status: 400 }),
        auth,
      );
    }

    const invite = await homeModel.findInviteByCode(code);
    if (!invite) {
      return withAuthCookie(
        json({ error: "Invite not found or expired" }, { status: 404 }),
        auth,
      );
    }

    if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
      return withAuthCookie(
        json({ error: "Invite has expired" }, { status: 400 }),
        auth,
      );
    }

    const existingMembership = await homeModel.findUserHomeMembership(
      auth.userId,
      invite.homeId,
    );

    if (existingMembership) {
      return withAuthCookie(
        json({ error: "User is already a member of this home" }, { status: 400 }),
        auth,
      );
    }

    await homeModel.addUserToHome(invite.homeId, auth.userId);

    return withAuthCookie(
      json(
        {
          message: "Invite accepted successfully",
          home: { id: invite.homeId, name: invite.home.name },
        },
        { status: 200 },
      ),
      auth,
    );
  } catch (error) {
    console.error("Error accepting invite:", error);
    return withAuthCookie(
      json(
        {
          error: "Failed to accept invite",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      ),
      auth,
    );
  }
}
