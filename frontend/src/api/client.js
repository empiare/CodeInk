import axios from 'axios';

const client = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => {
    const body = response.data;
    // Unwrap ApiResponse { success, data, message }
    const payload = body?.data ?? body;
    // Normalize pagination fields from MyBatis-Plus Page to frontend convention
    if (payload && payload.records && !payload.content) {
      return {
        ...payload,
        content: payload.records,
        totalPages: payload.pages ?? payload.totalPages,
        totalElements: payload.total ?? payload.totalElements,
      };
    }
    return payload;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(data || error.message);
    }
    return Promise.reject(error.message);
  }
);

export default client;
