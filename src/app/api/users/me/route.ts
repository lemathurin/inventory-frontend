import { NextRequest } from "next/server";
import { requireAuth, withAuthCookie } from "@/server/auth";
import { json } from "@/server/response";
import { getSanitizedBody } from "@/server/sanitize";
import * as userModel from "@/server/models/user-model";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if ("status" in auth) {
    return auth;
  }

  try {
    const user = await userModel.findUserById(auth.userId);

    if (!user) {
      return withAuthCookie(
        json({ error: "User not found" }, { status: 404 }),
        auth,
      );
    }

    const { id, ...rest } = user;
    return withAuthCookie(json({ userId: id, ...rest }, { status: 200 }), auth);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return withAuthCookie(
      json(
        {
          error: "An error occurred while fetching user data",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      ),
      auth,
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAuth(request);
  if ("status" in auth) {
    return auth;
  }

  try {
    const { password } = await getSanitizedBody<{ password: string }>(request);

    if (!password || typeof password !== "string") {
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

    const isPasswordValid = await userModel.verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return withAuthCookie(
        json({ error: "Incorrect password" }, { status: 400 }),
        auth,
      );
    }

    await userModel.deleteUser(auth.userId);

    return withAuthCookie(
      json({ message: "Account deleted successfully" }, { status: 200 }),
      auth,
    );
  } catch (error) {
    console.error("Error deleting user account:", error);
    return withAuthCookie(
      json(
        {
          error: "An error occurred while deleting the user account",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      ),
      auth,
    );
  }
}
