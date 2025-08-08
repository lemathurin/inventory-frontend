import axios from "@/lib/axios";
import { ROOM_ENDPOINTS } from "../endpoints";

export function useAddUserToRoom() {
  return async (roomId: string, userId?: string): Promise<void> => {
    try {
      const endpoint = ROOM_ENDPOINTS.roomUsers.replace(":roomId", roomId);
      await axios.post(endpoint, { roomId, userId });
    } catch (error) {
      console.error("Could not add user to room", error);
      throw error;
    }
  };
}
