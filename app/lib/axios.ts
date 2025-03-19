import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { getSession, signOut } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';
import { env } from '@/app/env.mjs';
import { refreshToken } from '../utils/authHelpers';

const axiosInstance = axios.create({
  baseURL: env.API_URL,
});

const serverInstance = axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    if (!config.url?.startsWith('http')) {
      config.url = `${config.baseURL}${config.url}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



serverInstance.interceptors.request.use(
  async (config) => {
    // Add any server-side specific headers here
    const session = await getServerSession(authOptions);

    if (session?.accessToken) {
      config.headers['Authorization'] = `Bearer ${session.accessToken}`;
    }

    if (!config.url?.startsWith('http')) {
      config.url = `${config.baseURL}${config.url}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

serverInstance.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if(error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // const session = await getServerSession(authOptions);
        // if(session?.accessToken) {
        //   await refreshToken(session.accessToken);
        // }
        // const response = await fetch(`${env.API_URL}/auth/token-refresh`, {
        //   method: 'POST',
        //   headers: {
        //     Authorization: `Bearer ${originalRequest?.headers['Authorization']}`,
        //   },
        // });
        originalRequest.headers = originalRequest.headers || {};
        const token = originalRequest?.headers['Authorization']?.split(' ')[1];
        const response = await refreshToken(token);
        if(!response.ok) {
          // If refresh fails, force sign out
          await signOut({ callbackUrl: '/auth/login' });
          return Promise.reject(error);
        }

        const updatedSession = await getServerSession(authOptions);
        if(updatedSession?.accessToken) {
          
          originalRequest.headers['Authorization'] = `Bearer ${updatedSession.accessToken}`;
          return serverInstance(originalRequest);
        }
      } catch (error) {
        await signOut({ callbackUrl: '/auth/login' });
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);


const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

const fetcherPost = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.post(url, { ...config });

  return res.data;
};

export { serverInstance, axiosInstance, fetcher, fetcherPost };

//TO USE:
// const data = await fetcher('/api/users');
// const data = await fetcherPost('/api/users', { method: 'POST', data: { name: 'John Doe' } });
