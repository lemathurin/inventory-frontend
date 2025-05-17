import { useState } from "react";
import { createHome } from "../endpoints/createHome";

export function useCreateHome() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createNewHome(name: string, address: string) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await createHome(name, address);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create home");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return { createNewHome, isLoading, error };
}
