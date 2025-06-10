export const ITEM_ENDPOINTS = {
  item: "/items/:itemId",
  createItem: "/items/:homeId/item",
  publicItems: "/items/:homeId/public",
} as const;
