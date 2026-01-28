import axios from 'axios';

// Setup axios interceptor untuk menambahkan token ke request CMS
axios.interceptors.request.use(
  (config) => {
    // Jika request ke /api/cms (kecuali /api/cms/auth/login)
    if (config.url?.includes('/api/cms') && !config.url?.includes('/api/cms/auth/login')) {
      const token = localStorage.getItem('cms_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 unauthorized - redirect ke login
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.url?.includes('/api/cms')) {
      localStorage.removeItem('cms_token');
      localStorage.removeItem('cms_user');
      if (window.location.pathname.startsWith('/cms') && !window.location.pathname.includes('/login')) {
        window.location.href = '/cms/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
