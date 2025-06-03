import axios from "@/lib/axios";
import { ROOM_ENDPOINTS } from "../endpoints";

export function useCreateRoom() {
  return async (homeId: string, name: string): Promise<void> => {
    try {
      await axios.post(`${ROOM_ENDPOINTS.createRoom}/${homeId}`, { name });
    } catch (error) {
      console.error("Could not create room", error);
      throw error;
    }
  };
}
