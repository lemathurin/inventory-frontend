import axios from "@/lib/axios";
import { isAxiosError } from "axios";
import { AUTH_ENDPOINTS } from "../constants/endpoints";

type LoginResponse = {
  id: string;
  homeId: string;
  hasHome: boolean;
};

export function useLogin() {
  return async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await axios.post<LoginResponse>(AUTH_ENDPOINTS.login, {
        email,
        password,
      });
      return response.data;
    } catch (err) {
      if (isAxiosError(err)) {
        throw new Error(err.response?.data?.error || "Failed to login");
      } else {
        throw new Error("Failed to login");
      }
    }
  };
}
