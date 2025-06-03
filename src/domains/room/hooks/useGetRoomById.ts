import axios from "@/lib/axios";
import { ROOM_ENDPOINTS } from "../endpoints";
import { RoomModel } from "../room.types";

export function useGetRoomById() {
  return async (roomId: string): Promise<RoomModel> => {
    try {
      const response = await axios.get<RoomModel>(
        `${ROOM_ENDPOINTS.room}/${roomId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Could not fetch room", error);
      throw error;
    }
  };
}
