export const HOME_ENDPOINTS = {
  home: "/homes/:homeId",
  createHome: "/homes/",
  getRoomsByHomeId: "/homes/:homeId/rooms",
  invite: "/homes/:homeId/invites",
  deleteInvite: "/homes/:homeId/invites/:inviteId",
  acceptInvite: "/homes/invites/accept",
  getHomeUsers: "/homes/:homeId/users",
  removeHomeUser: "/homes/:homeId/users/:userId",
} as const;
