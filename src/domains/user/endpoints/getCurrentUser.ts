import { apiUrl } from "@/config/api";
import { UserModel } from "../user.types";

export async function getCurrentUser(): Promise<UserModel | null> {
    try {
        const response = await fetch(apiUrl("/user/me"), {
            credentials: 'include',
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const userData: UserModel = await response.json();
        console.log("Fetched user data:", userData);
        return userData;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
};