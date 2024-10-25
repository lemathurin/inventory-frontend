export const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export const apiUrl = (path: string): string => {
    // Ensure the path starts with '/api'
    const apiPath = path.startsWith('/api') ? path : `/api${path}`;
    const url = `${API_BASE_URL}${apiPath}`;
    // console.log('API URL:', url);
    return url;
  };