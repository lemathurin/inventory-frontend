import axios from "@/lib/axios";
import { ROOM_ENDPOINTS } from "../endpoints";

export function useRemoveUserFromRoom() {
  return async (roomId: string, userId?: string): Promise<void> => {
    try {
      const endpoint = ROOM_ENDPOINTS.roomUsers.replace(":roomId", roomId);
      await axios.delete(endpoint, { data: { userId } });
    } catch (error) {
      console.error("Could not remove user from room", error);
      throw error;
    }
  };
}
