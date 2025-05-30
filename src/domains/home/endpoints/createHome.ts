import axios from "axios";
import { apiUrl } from "@/config/api";

export async function createHome(name: string, address: string) {
  const response = await axios.post(
    apiUrl("/homes/"),
    { name, address },
    { withCredentials: true },
  );
  return response.data;
}
