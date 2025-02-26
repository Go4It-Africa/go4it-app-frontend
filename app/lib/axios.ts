import axios, { AxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';
import { env } from '@/app/env.mjs';

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
    //console.log('config', config);

    return config;
  },
  (error) => {
    console.log('error in server axios interceptor', error);
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
