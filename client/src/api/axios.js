import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
});

export const endpoints = {
  auth: '/auth',
  admin: '/admin',
}

export default instance;