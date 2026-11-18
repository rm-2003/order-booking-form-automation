import axios, { AxiosError } from 'axios';

// API client with defaults
const apiClient = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This ensures cookies are sent with requests
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Ensure token is sent as Bearer token
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Error handling function
export const handleError = (error: unknown, defaultMessage = 'An error occurred'): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    
    if (axiosError.response?.data) {
      const data = axiosError.response.data;
      
      if (data.detail) return data.detail;
      if (data.message) return data.message;
      if (typeof data === 'string') return data;
      
      return JSON.stringify(data);
    }
    
    if (axiosError.message) return axiosError.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return defaultMessage;
};

// Master data API services
export const mastersApi = {
  // Manpower services
  manpower: {
    getAll: async () => {
      try {
        const response = await apiClient.get(`/masters/manpower`);
        return response.data;
      } catch (error) {
        console.error('Error fetching manpower data:', error);
        throw new Error(handleError(error, 'Failed to fetch manpower data'));
      }
    },
    
    getById: async (id: string) => {
      try {
        const response = await apiClient.get(`/masters/manpower/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching manpower entry:', error);
        throw new Error(handleError(error, 'Failed to fetch manpower entry'));
      }
    },
    
    create: async (data: any) => {
      try {
        const response = await apiClient.post('/masters/manpower', data);
        return response.data;
      } catch (error) {
        console.error('Error creating manpower entry:', error);
        throw new Error(handleError(error, 'Failed to create manpower entry'));
      }
    },
    
    update: async (id: string, data: any) => {
      try {
        const response = await apiClient.put(`/masters/manpower/${id}`, data);
        return response.data;
      } catch (error) {
        console.error('Error updating manpower entry:', error);
        throw new Error(handleError(error, 'Failed to update manpower entry'));
      }
    },
    
    delete: async (id: string) => {
      try {
        const response = await apiClient.delete(`/masters/manpower/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error deleting manpower entry:', error);
        throw new Error(handleError(error, 'Failed to delete manpower entry'));
      }
    }
  },
  
  // Capex services
  capex: {
    getAll: async () => {
      try {
        const response = await apiClient.get(`/masters/capex`);
        return response.data;
      } catch (error) {
        console.error('Error fetching capex data:', error);
        throw new Error(handleError(error, 'Failed to fetch capex data'));
      }
    },
    
    getById: async (id: string) => {
      try {
        const response = await apiClient.get(`/masters/capex/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching capex entry:', error);
        throw new Error(handleError(error, 'Failed to fetch capex entry'));
      }
    },
    
    create: async (data: any) => {
      try {
        const response = await apiClient.post('/masters/capex', data);
        return response.data;
      } catch (error) {
        console.error('Error creating capex entry:', error);
        throw new Error(handleError(error, 'Failed to create capex entry'));
      }
    },
    
    update: async (id: string, data: any) => {
      try {
        const response = await apiClient.put(`/masters/capex/${id}`, data);
        return response.data;
      } catch (error) {
        console.error('Error updating capex entry:', error);
        throw new Error(handleError(error, 'Failed to update capex entry'));
      }
    },
    
    delete: async (id: string) => {
      try {
        const response = await apiClient.delete(`/masters/capex/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error deleting capex entry:', error);
        throw new Error(handleError(error, 'Failed to delete capex entry'));
      }
    }
  },
  
  // Opex services
  opex: {
    getAll: async () => {
      try {
        const response = await apiClient.get(`/masters/opex`);
        return response.data;
      } catch (error) {
        console.error('Error fetching opex data:', error);
        throw new Error(handleError(error, 'Failed to fetch opex data'));
      }
    },
    
    getById: async (id: string) => {
      try {
        const response = await apiClient.get(`/masters/opex/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching opex entry:', error);
        throw new Error(handleError(error, 'Failed to fetch opex entry'));
      }
    },
    
    create: async (data: any) => {
      try {
        const response = await apiClient.post('/masters/opex', data);
        return response.data;
      } catch (error) {
        console.error('Error creating opex entry:', error);
        throw new Error(handleError(error, 'Failed to create opex entry'));
      }
    },
    
    update: async (id: string, data: any) => {
      try {
        const response = await apiClient.put(`/masters/opex/${id}`, data);
        return response.data;
      } catch (error) {
        console.error('Error updating opex entry:', error);
        throw new Error(handleError(error, 'Failed to update opex entry'));
      }
    },
    
    delete: async (id: string) => {
      try {
        const response = await apiClient.delete(`/masters/opex/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error deleting opex entry:', error);
        throw new Error(handleError(error, 'Failed to delete opex entry'));
      }
    }
  },
  
  // Rental services
  rental: {
    getAll: async () => {
      try {
        const response = await apiClient.get(`/masters/rental`);
        return response.data;
      } catch (error) {
        console.error('Error fetching rental data:', error);
        throw new Error(handleError(error, 'Failed to fetch rental data'));
      }
    },
    
    getById: async (id: string) => {
      try {
        const response = await apiClient.get(`/masters/rental/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching rental entry:', error);
        throw new Error(handleError(error, 'Failed to fetch rental entry'));
      }
    },
    
    create: async (data: any) => {
      try {
        const response = await apiClient.post('/masters/rental', data);
        return response.data;
      } catch (error) {
        console.error('Error creating rental entry:', error);
        throw new Error(handleError(error, 'Failed to create rental entry'));
      }
    },
    
    update: async (id: string, data: any) => {
      try {
        const response = await apiClient.put(`/masters/rental/${id}`, data);
        return response.data;
      } catch (error) {
        console.error('Error updating rental entry:', error);
        throw new Error(handleError(error, 'Failed to update rental entry'));
      }
    },
    
    delete: async (id: string) => {
      try {
        const response = await apiClient.delete(`/masters/rental/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error deleting rental entry:', error);
        throw new Error(handleError(error, 'Failed to delete rental entry'));
      }
    }
  },
  
  // Thresholds services
  thresholds: {
    getAll: async () => {
      try {
        const response = await apiClient.get(`/masters/thresholds`);
        return response.data;
      } catch (error) {
        console.error('Error fetching thresholds data:', error);
        throw new Error(handleError(error, 'Failed to fetch thresholds data'));
      }
    },
    
    getById: async (id: string) => {
      try {
        const response = await apiClient.get(`/masters/thresholds/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching threshold entry:', error);
        throw new Error(handleError(error, 'Failed to fetch threshold entry'));
      }
    },
    
    create: async (data: any) => {
      try {
        const response = await apiClient.post('/masters/thresholds', data);
        return response.data;
      } catch (error) {
        console.error('Error creating threshold entry:', error);
        throw new Error(handleError(error, 'Failed to create threshold entry'));
      }
    },
    
    update: async (id: string, data: any) => {
      try {
        const response = await apiClient.put(`/masters/thresholds/${id}`, data);
        return response.data;
      } catch (error) {
        console.error('Error updating threshold entry:', error);
        throw new Error(handleError(error, 'Failed to update threshold entry'));
      }
    },
    
    delete: async (id: string) => {
      try {
        const response = await apiClient.delete(`/masters/thresholds/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error deleting threshold entry:', error);
        throw new Error(handleError(error, 'Failed to delete threshold entry'));
      }
    }
  }
};

export default apiClient; 