import { useState } from "react";
import { updateUserName, updateUserEmail, updateUserPassword } from "../endpoints/updateUser";

export function useUpdateUserName() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function updateName(newName: string) {
        setIsLoading(true);
        setError(null);
        try {
            await updateUserName(newName);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update name");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    return { updateName, isLoading, error };
}

export function useUpdateUserEmail() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function updateEmail(newEmail: string) {
        setIsLoading(true);
        setError(null);
        try {
            await updateUserEmail(newEmail);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update email");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    return { updateEmail, isLoading, error };
}

export function useUpdateUserPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function updatePassword(currentPassword: string, newPassword: string) {
        setIsLoading(true);
        setError(null);
        try {
            await updateUserPassword(currentPassword, newPassword);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update password");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    return { updatePassword, isLoading, error };
}