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
    const { email } = await getSanitizedBody<{ email: string }>(request);

    if (!email || typeof email !== "string" || !userModel.isValidEmail(email)) {
      return withAuthCookie(
        json({ error: "Invalid email provided" }, { status: 400 }),
        auth,
      );
    }

    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return withAuthCookie(
        json({ error: "Email already in use" }, { status: 400 }),
        auth,
      );
    }

    const updatedUser = await userModel.updateUserEmail(auth.userId, email);
    return withAuthCookie(json(updatedUser, { status: 200 }), auth);
  } catch (error) {
    console.error("Error changing user email:", error);
    return withAuthCookie(
      json(
        {
          error: "An error occurred while changing the user email",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      ),
      auth,
    );
  }
}
