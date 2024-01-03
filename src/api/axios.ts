import axios, { AxiosError } from 'axios';

export const apiPublic = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiPublic.interceptors.response.use((response) => {
  return response.data;
});

export const apiPrivate = axios.create({
  // baseURL: 'http://abc.com', // request error
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

apiPrivate.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = `Bearer ${localStorage.getItem(
      'access_token',
    )}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

interface CustomAxiosError extends AxiosError {
  config: AxiosError['config'] & { triedRenewToken: boolean };
}

apiPrivate.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error: CustomAxiosError) => {
    const prevConfig = error.config;
    if (error.response?.status === 401 && !prevConfig.triedRenewToken) {
      prevConfig.triedRenewToken = true;
      try {
        console.log('try');
        const data = (await apiPublic.get('/auth/access-token', {
          withCredentials: true,
        })) as any;
        localStorage.setItem('access_token', data.data.access_token);
        return await apiPrivate(prevConfig);
      } catch (error) {
        return await Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);
