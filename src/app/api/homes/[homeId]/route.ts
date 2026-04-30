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

export async function GET(request: NextRequest, context: Context) {
  const auth = await requireAuth(request);
  if ("status" in auth) {
    return auth;
  }

  try {
    const { homeId } = context.params;
    const home = await homeModel.findHomeById(homeId, auth.userId);

    if (!home) {
      return withAuthCookie(json({ error: "Home not found" }, { status: 404 }), auth);
    }

    return withAuthCookie(json(home, { status: 200 }), auth);
  } catch (error) {
    console.error("Could not fetch home", error);
    return withAuthCookie(json({ error: "Could not fetch home" }, { status: 500 }), auth);
  }
}

export async function PATCH(request: NextRequest, context: Context) {
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

    const { name, address } = await getSanitizedBody<{
      name?: string;
      address?: string;
    }>(request);

    if (!name && !address) {
      return withAuthCookie(
        json({ error: "No fields to update" }, { status: 400 }),
        auth,
      );
    }

    const updatedHome = await homeModel.updateHomeById(homeId, { name, address });

    return withAuthCookie(
      json(
        {
          message: "Home updated successfully",
          home: updatedHome,
        },
        { status: 200 },
      ),
      auth,
    );
  } catch (error) {
    console.error("Error updating home:", error);
    return withAuthCookie(
      json(
        {
          error: "An error occurred while updating the home",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      ),
      auth,
    );
  }
}

export async function DELETE(request: NextRequest, context: Context) {
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

    if (home.items && home.items.length > 0) {
      return withAuthCookie(
        json({ error: "Cannot delete home with items" }, { status: 400 }),
        auth,
      );
    }

    await homeModel.deleteHomeById(homeId);

    return withAuthCookie(
      json({ message: "Home deleted successfully" }, { status: 200 }),
      auth,
    );
  } catch (error) {
    console.error("Error deleting home", error);
    return withAuthCookie(
      json(
        {
          error: "An error occurred while deleting the home",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      ),
      auth,
    );
  }
}
