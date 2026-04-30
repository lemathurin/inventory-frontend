import { NextRequest } from "next/server";
import { requireAuth, withAuthCookie } from "@/server/auth";
import { json } from "@/server/response";
import * as itemModel from "@/server/models/item-model";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if ("status" in auth) {
    return auth;
  }

  try {
    const items = await itemModel.findItemsByUserId(auth.userId);
    return withAuthCookie(json(items, { status: 200 }), auth);
  } catch (error) {
    console.error(error);
    return withAuthCookie(json({ error: "Could not fetch items" }, { status: 500 }), auth);
  }
}
