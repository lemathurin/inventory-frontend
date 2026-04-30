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
    const { currentPassword, newPassword } = await getSanitizedBody<{
      currentPassword: string;
      newPassword: string;
    }>(request);

    if (
      !currentPassword ||
      !newPassword ||
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string"
    ) {
      return withAuthCookie(
        json({ error: "Invalid password provided" }, { status: 400 }),
        auth,
      );
    }

    const user = await userModel.findUserAuthById(auth.userId);

    if (!user) {
      return withAuthCookie(
        json({ error: "User not found" }, { status: 404 }),
        auth,
      );
    }

    const isPasswordValid = await userModel.verifyPassword(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      return withAuthCookie(
        json({ error: "Current password is incorrect" }, { status: 400 }),
        auth,
      );
    }

    await userModel.updateUserPassword(auth.userId, newPassword);

    return withAuthCookie(
      json({ message: "Password updated successfully" }, { status: 200 }),
      auth,
    );
  } catch (error) {
    console.error("Error changing user password:", error);
    return withAuthCookie(
      json(
        {
          error: "An error occurred while changing the user password",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      ),
      auth,
    );
  }
}
