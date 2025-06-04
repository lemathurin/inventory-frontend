import axios from "@/lib/axios";
import { ROOM_ENDPOINTS } from "../endpoints";

export function useUpdateRoom() {
  return async (roomId: string, name?: string): Promise<void> => {
    try {
      const endpoint = ROOM_ENDPOINTS.room.replace(":roomId", roomId);
      await axios.patch(endpoint, { name });
    } catch (error) {
      console.error("Could not update room", error);
      throw error;
    }
  };
}
