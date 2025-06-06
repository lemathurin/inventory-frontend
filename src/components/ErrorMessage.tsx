import { AlertCircle } from "lucide-react";

export function ErrorMessage({ error }: { error?: string }) {
  if (!error) return null;

  return (
    <div className="flex items-center gap-2 mt-1 p-2 bg-red-50 border border-red-200 rounded-md dark:bg-red-950 dark:border-red-700">
      <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 dark:text-red-300" />
      <span className="text-sm text-red-700 dark:text-red-200">{error}</span>
    </div>
  );
}
