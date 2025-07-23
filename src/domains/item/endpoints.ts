export const ITEM_ENDPOINTS = {
  item: "/items/:itemId",
  createItem: "/items/:homeId/item",
  homeItems: "/items/home/:homeId",
  roomItems: "/items/room/:roomId",
  permissions: "/items/:itemId/permissions",
} as const;
