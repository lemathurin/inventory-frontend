import axios from "@/lib/axios";
import { HOME_ENDPOINTS } from "../endpoints";
import { HomeModel } from "@/domains/home/home.types";

export function useGetHomeById() {
  return async (homeId: string): Promise<HomeModel> => {
    try {
      const response = await axios.get<HomeModel>(
        `${HOME_ENDPOINTS.home}/${homeId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Could not fetch home", error);
      throw error;
    }
  };
}
