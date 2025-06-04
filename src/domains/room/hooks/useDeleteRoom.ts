import axios from "@/lib/axios";
import { ROOM_ENDPOINTS } from "../endpoints";

export function useDeleteRoom() {
  return async (roomId: string): Promise<void> => {
    try {
      const endpoint = ROOM_ENDPOINTS.room.replace(":roomId", roomId);
      await axios.delete(endpoint);
    } catch (error) {
      console.error("Could not delete room", error);
      throw error;
    }
  };
}
