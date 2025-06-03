import axios from "@/lib/axios";
import { ROOM_ENDPOINTS } from "../endpoints";

export function useCreateRoom() {
  return async (homeId: string, name: string): Promise<void> => {
    try {
      const endpoint = ROOM_ENDPOINTS.createRoom.replace(":homeId", homeId);
      await axios.post(endpoint, { name });
    } catch (error) {
      console.error("Could not create room", error);
      throw error;
    }
  };
}
