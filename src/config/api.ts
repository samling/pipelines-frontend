export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

// Helper function to get common headers
export const getApiHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_KEY}`,
});