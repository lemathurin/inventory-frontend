import { NextRequest } from "next/server";
import { requireAuth, withAuthCookie } from "@/server/auth";
import { json } from "@/server/response";
import { getSanitizedBody } from "@/server/sanitize";
import * as itemModel from "@/server/models/item-model";

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
    const {
      name,
      description,
      roomId,
      public: isPublic,
      purchaseDate,
      price,
      hasWarranty,
      warrantyType,
      warrantyLength,
    } = await getSanitizedBody<{
      name: string;
      description: string;
      roomId?: string;
      public?: boolean;
      purchaseDate?: string | null;
      price?: number | null;
      hasWarranty?: boolean;
      warrantyType?: string | null;
      warrantyLength?: number | null;
    }>(request);

    const item = await itemModel.createNewItem(
      name,
      description,
      homeId,
      auth.userId,
      roomId,
      isPublic,
      purchaseDate ? new Date(purchaseDate) : null,
      price,
      hasWarranty,
      warrantyType,
      warrantyLength,
    );

    return withAuthCookie(json(item, { status: 201 }), auth);
  } catch (error) {
    console.error("Error creating item:", error);
    return withAuthCookie(
      json(
        {
          error: "Could not create item",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      ),
      auth,
    );
  }
}
