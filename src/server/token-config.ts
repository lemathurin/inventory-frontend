export const TOKEN_CONFIG = {
  duration: "7d",
  refreshThreshold: 3 * 24 * 60,
  cookieMaxAge: 7 * 24 * 60 * 60 * 1000,
} as const;

export interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
}
