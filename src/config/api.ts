export const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const apiUrl = (path: string): string => {
  const apiPath = path.startsWith("/api") ? path : `/api${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${apiPath}` : apiPath;
};
