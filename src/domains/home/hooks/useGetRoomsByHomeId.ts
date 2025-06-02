import axios from "@/lib/axios";
import { HOME_ENDPOINTS } from "../endpoints";
import { RoomModel } from "@/domains/room/room.types";

export function useGetRoomsByHomeId() {
  return async (homeId: string): Promise<RoomModel[]> => {
    try {
      const response = await axios.get<RoomModel[]>(
        `${HOME_ENDPOINTS.getRoomsByHomeId}/${homeId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Could not fetch rooms", error);
      throw error;
    }
  };
}
