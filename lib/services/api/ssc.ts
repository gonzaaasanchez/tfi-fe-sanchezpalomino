import { createStandaloneToast } from '@chakra-ui/react';
import axios, { AxiosInstance } from 'axios';
import { getSession } from 'next-auth/react';

export const ClientApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

ClientApi.interceptors.request.use(async config => {
  try {
    const session = await getSession();

    if (!config.headers.Authorization && session?.user?.accessToken) {
      config.headers.Authorization = `Bearer ${session?.user?.accessToken}`;
    }
  } catch (error) {
    // Silently handle error
  }

  return config;
});

ClientApi.interceptors.response.use(
  response => response,
  error => {
    const { toast } = createStandaloneToast();
    const message = error.response?.data?.message || error.message || 'Error';
    toast({
      title: '',
      description: Array.isArray(message) ? message[0] : message,
      status: 'error',
      duration: 5000,
      isClosable: true
    });
    return Promise.reject(error);
  }
);
