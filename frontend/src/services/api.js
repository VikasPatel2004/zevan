const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    // If the server says "Invalid token" or "No token provided", 
    // the token has expired or is corrupted. Clear auth and redirect.
    if (response.status === 401) {
      const errorData = await response.json().catch(() => ({}));
      // Only clear auth for genuine token-related 401s, not login failures
      const isTokenIssue =
        errorData.message === 'Invalid token' ||
        errorData.message === 'No token provided';

      if (isTokenIssue) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(errorData.message || 'Authentication failed');
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API request failed');
  }
  return response.json();
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const api = {
  get: async (url, options = {}) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    });
    return handleResponse(response);
  },

  post: async (url, body, options = {}) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
      body: JSON.stringify(body),
      ...options,
    });
    return handleResponse(response);
  },

  put: async (url, body, options = {}) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
      body: JSON.stringify(body),
      ...options,
    });
    return handleResponse(response);
  },

  delete: async (url, options = {}) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    });
    return handleResponse(response);
  },
};

export default api;
