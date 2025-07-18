import axios, { AxiosInstance } from 'axios';
import { getSession } from 'next-auth/react';

export const ClientApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

ClientApi.interceptors.request.use(async (config) => {
  try {
    const session = await getSession();

    if (!config.headers.Authorization && session?.user?.token) {
      config.headers.Authorization = `Bearer ${session?.user?.token}`;
    }
  } catch (error) {
    // Silently handle error
  }

  return config;
});

ClientApi.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
