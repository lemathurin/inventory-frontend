import axios from "@/lib/axios";
import { ROOM_ENDPOINTS } from "../endpoints";

export function useGetRoomUsers() {
  return async (roomId: string) => {
    try {
      const endpoint = ROOM_ENDPOINTS.roomUsers.replace(":roomId", roomId);
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error("Could not fetch room users", error);
      throw error;
    }
  };
}
