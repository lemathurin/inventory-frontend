import { clearTokenCookie } from "@/server/auth";
import { json } from "@/server/response";

export async function POST() {
  try {
    const response = json({ message: "Logged out successfully" }, { status: 200 });
    clearTokenCookie(response);
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return json({ error: "An error occurred during logout" }, { status: 500 });
  }
}
