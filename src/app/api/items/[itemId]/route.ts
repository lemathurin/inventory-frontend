import { NextRequest } from "next/server";
import { requireAuth, withAuthCookie } from "@/server/auth";
import { requireEntityAdmin } from "@/server/permissions";
import { json } from "@/server/response";
import { getSanitizedBody } from "@/server/sanitize";
import * as itemModel from "@/server/models/item-model";

type Context = {
  params: {
    itemId: string;
  };
};

export async function GET(request: NextRequest, context: Context) {
  const auth = await requireAuth(request);
  if ("status" in auth) {
    return auth;
  }

  try {
    const { itemId } = context.params;
    const item = await itemModel.findItemByIdAndUserId(itemId, auth.userId);

    if (!item) {
      return withAuthCookie(
        json(
          {
            error: "Item not found or you do not have permission to access it",
          },
          { status: 404 },
        ),
        auth,
      );
    }

    const response = {
      ...item,
      users: item.users.map((userItem) => ({
        ...userItem.user,
        isAdmin: userItem.admin,
      })),
    };

    return withAuthCookie(json(response, { status: 200 }), auth);
  } catch (error) {
    console.error("Error fetching item:", error);
    return withAuthCookie(
      json(
        {
          error: "Failed to fetch item",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      ),
      auth,
    );
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  const auth = await requireAuth(request);
  if ("status" in auth) {
    return auth;
  }

  try {
    const { itemId } = context.params;
    const isAdmin = await requireEntityAdmin("item", itemId, auth.userId);

    if (!isAdmin) {
      return withAuthCookie(
        json({ error: "Admin access required for this item" }, { status: 403 }),
        auth,
      );
    }

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
      name?: string;
      description?: string;
      roomId?: string | null;
      public?: boolean;
      purchaseDate?: string | null;
      price?: number | null;
      hasWarranty?: boolean;
      warrantyType?: string | null;
      warrantyLength?: number | null;
    }>(request);

    const hasUpdates = [
      name,
      description,
      roomId,
      isPublic,
      purchaseDate,
      price,
      hasWarranty,
      warrantyType,
      warrantyLength,
    ].some((field) => field !== undefined);

    if (!hasUpdates) {
      return withAuthCookie(
        json({ error: "No fields to update" }, { status: 400 }),
        auth,
      );
    }

    const updatedItem = await itemModel.updateItem(itemId, {
      name,
      description,
      roomId,
      public: isPublic,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : purchaseDate,
      price,
      hasWarranty,
      warrantyType,
      warrantyLength,
    });

    return withAuthCookie(
      json(
        {
          message: "Item updated successfully",
          item: updatedItem,
        },
        { status: 200 },
      ),
      auth,
    );
  } catch (error) {
    console.error("Error updating item:", error);
    return withAuthCookie(
      json(
        {
          error: "Failed to update item",
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
    const { itemId } = context.params;
    const isAdmin = await requireEntityAdmin("item", itemId, auth.userId);

    if (!isAdmin) {
      return withAuthCookie(
        json({ error: "Admin access required for this item" }, { status: 403 }),
        auth,
      );
    }

    await itemModel.deleteItemById(itemId);

    return withAuthCookie(
      json({ message: "Item deleted successfully" }, { status: 200 }),
      auth,
    );
  } catch (error) {
    console.error("Error deleting item:", error);
    return withAuthCookie(
      json(
        {
          error: "Failed to delete item",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      ),
      auth,
    );
  }
}
