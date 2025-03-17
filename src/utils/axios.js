import axios from 'axios';

import { API_URL } from './config';
import Storage from './storage';

const instance = axios.create({
  baseURL: API_URL,
  timeout: 120 * 1000,
  //  timeoutErrorMessage: t('timeoutErrorMessage')
});

instance.interceptors.request.use(async (request) => {
  const accessToken = await Storage.getItem('accessToken');

  if (accessToken) {
    request.headers.authorization = `Bearer ${accessToken}`;
  }

  return request;
});

// Add a response interceptor
instance.interceptors.response.use(
  (response) => { return response.data; },
  (error) => { return Promise.reject(error); },
);

export default instance;
