import { NextRequest } from "next/server";
import { requireAuth, withAuthCookie } from "@/server/auth";
import { json } from "@/server/response";
import { getSanitizedBody } from "@/server/sanitize";
import * as userModel from "@/server/models/user-model";

export async function PATCH(request: NextRequest) {
  const auth = await requireAuth(request);
  if ("status" in auth) {
    return auth;
  }

  try {
    const { name } = await getSanitizedBody<{ name: string }>(request);

    if (!name || typeof name !== "string") {
      return withAuthCookie(
        json({ error: "Invalid name provided" }, { status: 400 }),
        auth,
      );
    }

    const updatedUser = await userModel.updateUserName(auth.userId, name);
    return withAuthCookie(json(updatedUser, { status: 200 }), auth);
  } catch (error) {
    console.error("Error changing user name:", error);
    return withAuthCookie(
      json(
        {
          error: "An error occurred while changing the user name",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      ),
      auth,
    );
  }
}
