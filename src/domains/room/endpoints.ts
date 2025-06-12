export const ROOM_ENDPOINTS = {
  room: "/rooms/:roomId",
  createRoom: "/rooms/:homeId/room",
  roomUsers: "/rooms/:roomId/users",
} as const;
