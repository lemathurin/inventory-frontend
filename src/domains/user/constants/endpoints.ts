export const AUTH_ENDPOINTS = {
  register: "/auth/register",
  login: "/auth/login",
  logout: "/auth/logout",
  // token: "/auth/token"
} as const;

export const USER_ENDPOINTS = {
  me: "/users/me",
  updateName: "/users/me/name",
  updateEmail: "/users/me/email",
  updatePassword: "/users/me/password",
} as const;
