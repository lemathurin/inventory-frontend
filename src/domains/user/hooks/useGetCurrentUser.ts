import { useEffect, useState } from "react";
import { getCurrentUser } from "../endpoints/getCurrentUser";
import { UserModel } from "../user.types";

export function useGetCurrentUser() {
  const [user, setUser] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        console.log("Fetched user data with useGetCurrentUser:", userData);
      } catch (err) {
        console.error('Error fetching current user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
}
