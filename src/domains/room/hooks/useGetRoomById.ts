import axios from "@/lib/axios";
import { ROOM_ENDPOINTS } from "../endpoints";
import { RoomModel } from "../room.types";

export function useGetRoomById() {
  return async (roomId: string): Promise<RoomModel> => {
    try {
      const endpoint = ROOM_ENDPOINTS.room.replace(":roomId", roomId);
      const response = await axios.get<RoomModel>(endpoint);
      return response.data;
    } catch (error) {
      console.error("Could not fetch room", error);
      throw error;
    }
  };
}
