import axios from "@/lib/axios";
import { ROOM_ENDPOINTS } from "../endpoints";

export function useGetRoomPermissions() {
  return async (roomId: string) => {
    try {
      const endpoint = ROOM_ENDPOINTS.permissions.replace(":roomId", roomId);
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error("Could not get room permissions", error);
      throw error;
    }
  };
}
