import axios from "@/lib/axios";
import { HOME_ENDPOINTS } from "../endpoints";
import { RoomModel } from "@/domains/room/room.types";

export function useGetRoomsByHomeId() {
  return async (homeId: string): Promise<RoomModel[]> => {
    try {
      const endpoint = HOME_ENDPOINTS.getRoomsByHomeId.replace(
        ":homeId",
        homeId,
      );
      const response = await axios.get<RoomModel[]>(endpoint);
      return response.data;
    } catch (error) {
      console.error("Could not fetch rooms", error);
      throw error;
    }
  };
}
