import axios from 'axios';

// Resolve API base URL:
// 1. Read import.meta.env.VITE_API_URL (e.g. from Vercel environment variables)
// 2. Fall back to local development server 'http://localhost:5000'
const rawUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').trim();

// Strip any trailing slashes
const normalizedBase = rawUrl.replace(/\/+$/, '');

// Ensure /api is appended if not already present, as all Express routes are mounted under /api
export const API_BASE_URL = normalizedBase.endsWith('/api')
  ? normalizedBase
  : `${normalizedBase}/api`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred';
    if (!error.response) {
      // Backend not running or unreachable
      message = `Backend service unavailable. Check that the CareFlow API server is reachable at ${API_BASE_URL}.`;
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
