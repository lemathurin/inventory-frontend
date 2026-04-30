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
    const users = await homeModel.findUsersByHomeId(homeId);
    return withAuthCookie(json(users, { status: 200 }), auth);
  } catch (error) {
    console.error("Error fetching users:", error);
    return withAuthCookie(
      json(
        {
          error: "An error occurred while fetching users",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      ),
      auth,
    );
  }
}
