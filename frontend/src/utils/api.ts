const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
// const API_BASE_URL = 'https://taskma-p59o.onrender.com';

export { API_BASE_URL };

export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const headers = new Headers(options.headers);

  headers.set('Content-Type', 'application/json');

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  return response;
};
