import jwt from "jsonwebtoken";
import type { NextRequest, NextResponse } from "next/server";
import { json } from "@/server/response";
import { TOKEN_CONFIG, type TokenPayload } from "@/server/token-config";

type AuthSuccess = {
  userId: string;
  refreshedToken?: string;
};

const getCookieOptions = () =>
  ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: TOKEN_CONFIG.cookieMaxAge / 1000,
    path: "/",
  });

export const generateToken = (userId: string): string => {
  const now = Math.floor(Date.now() / 1000);

  return jwt.sign(
    {
      userId,
      iat: now,
      lastActivity: now,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: TOKEN_CONFIG.duration },
  );
};

export const setTokenCookie = (response: NextResponse, token: string) => {
  response.cookies.set("token", token, getCookieOptions());
};

export const clearTokenCookie = (response: NextResponse) => {
  response.cookies.set("token", "", {
    ...getCookieOptions(),
    maxAge: 0,
  });
};

export const requireAuth = async (
  request: NextRequest,
): Promise<AuthSuccess | NextResponse> => {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return json({ error: "Access token required" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as TokenPayload;

    if (!payload?.userId) {
      return json({ error: "Invalid token payload" }, { status: 403 });
    }

    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiration = payload.exp - now;

    if (timeUntilExpiration <= TOKEN_CONFIG.refreshThreshold) {
      return {
        userId: payload.userId,
        refreshedToken: generateToken(payload.userId),
      };
    }

    return { userId: payload.userId };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return json(
        { error: "Access token expired", code: "TOKEN_EXPIRED" },
        { status: 401 },
      );
    }

    return json({ error: "Invalid access token" }, { status: 403 });
  }
};

export const withAuthCookie = (
  response: NextResponse,
  auth: AuthSuccess,
): NextResponse => {
  if (auth.refreshedToken) {
    setTokenCookie(response, auth.refreshedToken);
    response.headers.set("X-Token-Refreshed", "true");
  }

  return response;
};
