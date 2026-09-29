import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred';
    if (!error.response) {
      // Backend not running or unreachable
      message = 'Backend service unavailable. Check that the CareFlow API server is running on http://localhost:5000.';
    } else if (error.response.status === 503) {
      message = error.response.data?.message || 'Service temporarily unavailable. AI or backend resource busy.';
    } else if (error.response.status === 502) {
      message = 'Upstream service gateway error. Check remote API connectivity.';
    } else if (error.response.status === 404) {
      message = error.response.data?.message || 'Requested operational endpoint or resource not found.';
    } else if (error.response.data?.error) {
      message = error.response.data.error;
    } else if (error.response.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);
