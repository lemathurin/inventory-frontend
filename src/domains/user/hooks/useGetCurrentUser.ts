import axios from "@/lib/axios";
import { isAxiosError } from "axios";
import { USER_ENDPOINTS } from "../endpoints";
import { UserModel } from "../user.types";

export function useGetCurrentUser() {
  return async (): Promise<UserModel> => {
    try {
      const response = await axios.get(USER_ENDPOINTS.me);
      return response.data;
    } catch (err) {
      if (isAxiosError(err)) {
        throw new Error(
          err.response?.data?.error || "Failed to get current user",
        );
      } else {
        throw new Error("Failed to get current user");
      }
    }
  };
}
