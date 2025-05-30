import axios from "axios";
import { apiUrl } from "@/config/api";
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();

  const logout = async () => {
    try {
      await axios.post(
        apiUrl("/auth/logout"),
        {},
        {
          withCredentials: true,
        },
      );
      // Force a full page reload to clear all client-side state
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      throw error; // Re-throw the error so the calling component can handle it
    }
  };

  return { logout };
}
