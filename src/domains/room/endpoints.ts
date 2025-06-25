export const ROOM_ENDPOINTS = {
  room: "/rooms/:roomId",
  createRoom: "/rooms/:homeId/room",
  roomUsers: "/rooms/:roomId/users",
  permissions: "/rooms/:roomId/permissions",
} as const;
