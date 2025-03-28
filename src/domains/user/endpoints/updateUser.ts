import { apiUrl } from "@/config/api";

export async function updateUserName(newName: string): Promise<void> {
    const response = await fetch(apiUrl("/user/change-name"), {
        method: "PUT",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ newName }),
    });
    if (!response.ok) throw new Error("Failed to update name");
}

export async function updateUserEmail(newEmail: string): Promise<void> {
    const response = await fetch(apiUrl("/user/change-email"), {
        method: "PUT",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ newEmail }),
    });
    if (!response.ok) throw new Error("Failed to update email");
}

export async function updateUserPassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await fetch(apiUrl("/user/change-password"), {
        method: "PUT",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!response.ok) throw new Error("Failed to update password");
}