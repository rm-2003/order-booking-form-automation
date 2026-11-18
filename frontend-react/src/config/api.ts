export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

export const fetchWithRetry = async (url: string, options: RequestInit, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429) {
        // If rate limited, wait with exponential backoff
        const waitTime = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw new Error('Max retries reached');
};

export const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
}; 