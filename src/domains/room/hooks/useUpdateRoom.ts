import axios from "@/lib/axios";
import { ROOM_ENDPOINTS } from "../endpoints";

export function useUpdateRoom() {
  return async (roomId: string, name?: string): Promise<void> => {
    try {
      await axios.patch(`${ROOM_ENDPOINTS.room}/${roomId}`, { name });
    } catch (error) {
      console.error("Could not update room", error);
      throw error;
    }
  };
}
