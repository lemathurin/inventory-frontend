import { useState } from "react";
import { createUser } from "../endpoints/createUser";

export function useCreateUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createNewUser(name: string, email: string, password: string) {
    setIsLoading(true);
    setError(null);
    try {
      await createUser(name, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return { createNewUser, isLoading, error };
}
