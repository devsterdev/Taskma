const API_BASE_URL = 'http://localhost:3000';

export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem('accessToken');
  
  const headers = new Headers(options.headers);

  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
};
