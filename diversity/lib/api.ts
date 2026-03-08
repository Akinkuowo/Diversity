const API_URL = 'http://localhost:4000';

export const api = {
  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
};
