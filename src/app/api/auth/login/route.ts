import { NextRequest } from "next/server";
import { generateToken, setTokenCookie } from "@/server/auth";
import { json } from "@/server/response";
import { getSanitizedBody } from "@/server/sanitize";
import * as userModel from "@/server/models/user-model";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await getSanitizedBody<{
      email: string;
      password: string;
    }>(request);

    const user = await userModel.findUserByEmail(email);

    if (!user) {
      return json({ error: "Invalid email or password" }, { status: 400 });
    }

    const validPassword = await userModel.verifyPassword(password, user.password);

    if (!validPassword) {
      return json({ error: "Invalid email or password" }, { status: 400 });
    }

    const token = generateToken(user.id);
    const homeId = user.homes.length > 0 ? user.homes[0].homeId : null;
    const hasHome = user.homes.length > 0;
    const response = json({ id: user.id, homeId, hasHome }, { status: 200 });

    setTokenCookie(response, token);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return json({ error: "Invalid credentials" }, { status: 401 });
  }
}
