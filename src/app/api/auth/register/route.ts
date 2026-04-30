import { NextRequest } from "next/server";
import { generateToken, setTokenCookie } from "@/server/auth";
import { json } from "@/server/response";
import { getSanitizedBody } from "@/server/sanitize";
import * as userModel from "@/server/models/user-model";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await getSanitizedBody<{
      email: string;
      password: string;
      name: string;
    }>(request);

    const user = await userModel.createUser(email, password, name);
    const token = generateToken(user.id);
    const response = json({ id: user.id }, { status: 201 });

    setTokenCookie(response, token);

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return json(
      { error: "An error occurred during registration" },
      { status: 500 },
    );
  }
}
