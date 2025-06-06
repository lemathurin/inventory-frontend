import axios from "@/lib/axios";
import { ROOM_ENDPOINTS } from "../endpoints";
import { RoomModel } from "../room.types";

export function useGetRoomUsers() {
  return async (roomId: string): Promise<RoomModel> => {
    try {
      const endpoint = ROOM_ENDPOINTS.getRoomUsers.replace(":roomId", roomId);
      const response = await axios.get<RoomModel>(endpoint);
      return response.data;
    } catch (error) {
      console.error("Could not fetch room users", error);
      throw error;
    }
  };
}
