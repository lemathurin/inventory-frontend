import axios from "@/lib/axios";
import { ROOM_ENDPOINTS } from "../endpoints";

export function useDeleteRoom() {
  return async (roomId: string): Promise<void> => {
    try {
      await axios.delete(`${ROOM_ENDPOINTS.room}/${roomId}`);
    } catch (error) {
      console.error("Could not delete room", error);
      throw error;
    }
  };
}
