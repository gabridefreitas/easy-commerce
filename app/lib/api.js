import axios from 'axios';

const isServer = typeof window === 'undefined';

const baseURL = isServer
  ? process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
  : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL,
  withCredentials: true
});
