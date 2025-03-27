import { useEffect, useState } from "react";
import { getCurrentUser } from "../endpoints/getCurrentUser";
import { UserModel } from "../user.types";

export function useGetCurrentUser() {
  const [user, setUser] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        // console.log("Setting user data:", userData);
        setUser(userData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
}
