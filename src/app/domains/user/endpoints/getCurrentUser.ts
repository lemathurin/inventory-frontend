import { apiUrl } from "@/config/api";

export async function getCurrentUser() {
    try {
        const response = await fetch(apiUrl("/user/me"), {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
};