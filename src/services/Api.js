import axios from 'axios';

// Endpoint base da sua API
export const BASE_URL = 'https://192.168.0.16:8000/';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
