import axios from "@/lib/axios";
import { isAxiosError } from "axios";
import { AUTH_ENDPOINTS } from "../endpoints";

export function useCreateUser() {
  return async (
    name: string,
    email: string,
    password: string,
  ): Promise<void> => {
    try {
      await axios.post(AUTH_ENDPOINTS.register, { name, email, password });
    } catch (err) {
      if (isAxiosError(err)) {
        throw new Error(err.response?.data?.error || "Failed to create user");
      } else {
        throw new Error("Failed to create user");
      }
    }
  };
}
