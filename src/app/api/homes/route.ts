import { NextRequest } from "next/server";
import { requireAuth, withAuthCookie } from "@/server/auth";
import { json } from "@/server/response";
import { getSanitizedBody } from "@/server/sanitize";
import * as homeModel from "@/server/models/home-model";

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if ("status" in auth) {
    return auth;
  }

  try {
    const { name, address } = await getSanitizedBody<{
      name: string;
      address: string;
    }>(request);

    const home = await homeModel.createNewHome(name, address, auth.userId);

    return withAuthCookie(
      json(
        {
          message: "Home created successfully",
          home: {
            id: home.id,
            name: home.name,
          },
        },
        { status: 201 },
      ),
      auth,
    );
  } catch (error) {
    console.error("Error creating home:", error);
    return withAuthCookie(
      json(
        {
          error: "An error occurred while creating the home",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      ),
      auth,
    );
  }
}
