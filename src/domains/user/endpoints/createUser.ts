import { apiUrl } from "@/config/api";

export async function createUser(
  name: string,
  email: string,
  password: string,
): Promise<void> {
  const response = await fetch(apiUrl("/auth/register"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create user");
  }
}
