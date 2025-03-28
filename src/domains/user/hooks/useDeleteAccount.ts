import { useState } from "react";
import { deleteAccount } from "../endpoints/deleteAccount";

export function useDeleteAccount() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function deleteUserAccount(password: string) {
        setIsLoading(true);
        setError(null);
        try {
            await deleteAccount(password);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete account");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    return { deleteUserAccount, isLoading, error };
}