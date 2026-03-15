const API_URL = 'http://localhost:3001';

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  get: async (endpoint: string, options?: { params?: Record<string, any> }) => {
    const headers = getHeaders();
    delete headers['Content-Type'];

    let url = `${API_URL}${endpoint}`;
    if (options?.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `${url.includes('?') ? '&' : '?'}${queryString}`;
      }
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || 'API request failed');
      (error as any).response = {
        status: response.status,
        data: errorData,
      };
      throw error;
    }

    return await response.json();
  },
  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || 'API request failed');
      (error as any).response = {
        status: response.status,
        data: errorData,
      };
      throw error;
    }

    return await response.json();
  },
  upload: async (endpoint: string, formData: FormData) => {
    const headers = getHeaders();
    // Delete Content-Type so the browser sets it to multipart/form-data with the correct boundary
    delete headers['Content-Type'];

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || 'File upload failed');
      (error as any).response = {
        status: response.status,
        data: errorData,
      };
      throw error;
    }

    return await response.json();
  },
  patch: async (endpoint: string, data?: any) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || 'API request failed');
      (error as any).response = {
        status: response.status,
        data: errorData,
      };
      throw error;
    }

    return await response.json();
  },
  put: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || 'API request failed');
      (error as any).response = {
        status: response.status,
        data: errorData,
      };
      throw error;
    }

    return await response.json();
  },
  delete: async (endpoint: string) => {
    const headers = getHeaders();
    delete headers['Content-Type'];

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || 'API request failed');
      (error as any).response = {
        status: response.status,
        data: errorData,
      };
      throw error;
    }

    return await response.json();
  },
};
