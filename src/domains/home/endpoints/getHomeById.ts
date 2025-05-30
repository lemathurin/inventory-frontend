import { apiUrl } from "@/config/api";

export async function getHomeById(homeId: string) {
  try {
    const response = await fetch(apiUrl(`/homes/${homeId}`), {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const homeData = await response.json();
    return homeData;
  } catch (error) {
    console.error("Error fetching home data:", error);
    return null;
  }
}
