import { apiUrl } from "@/config/api";

export async function deleteUser(password: string): Promise<void> {
    const response = await fetch(apiUrl("/user/delete-account"), {
        method: "DELETE",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
    });
    if (!response.ok) throw new Error("Failed to delete account");
}