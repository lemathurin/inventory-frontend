import axios from "axios";
import { useState } from "react";
import { apiUrl } from "@/config/api";

type FormData = {
  email: string;
  password: string;
};

type LoginResponse = {
  id: string;
  homeId: string;
  hasHome: boolean;
};

export function useLogin() {
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(data: FormData) {
    try {
      const response = await axios.post<LoginResponse>(
        apiUrl(`/auth/login`),
        data,
        { withCredentials: true },
      );

      // NOTE: Redirect to onboarding if no home
      const target = response.data.hasHome
        ? `/home/${response.data.homeId}`
        : "/onboarding/start/";
      window.location.href = target;

      return response.data;
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please check your credentials.");
      throw err;
    }
  }

  return { handleLogin, error };
}
