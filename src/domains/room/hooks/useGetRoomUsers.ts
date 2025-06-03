import axios from "@/lib/axios";
import { ROOM_ENDPOINTS } from "../endpoints";
import { RoomModel } from "../room.types";

export function useGetRoomUsers() {
  return async (roomId: string): Promise<RoomModel> => {
    try {
      const response = await axios.get<RoomModel>(
        `${ROOM_ENDPOINTS.getRoomUsers}/${roomId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Could not fetch room users", error);
      throw error;
    }
  };
}
