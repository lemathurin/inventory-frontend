export const ROOM_ENDPOINTS = {
  room: "/rooms/:roomId",
  createRoom: "/rooms/:homeId/room",
  getRoomUsers: "/rooms/:roomId/users",
} as const;
