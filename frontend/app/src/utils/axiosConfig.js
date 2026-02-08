// File ini setup axios dengan interceptors untuk handle authentication
// Interceptor itu kayak middleware yang jalan otomatis sebelum/sesudah request
// Jadi kita gak perlu attach token manual di setiap request - lebih praktis!

import axios from 'axios';

// ============================================
// REQUEST INTERCEPTOR
// ============================================
// Interceptor ini jalan SEBELUM request dikirim ke server
// Fungsinya: attach JWT token ke header Authorization (kalau ada)
//
// Kenapa perlu ini?
// - Supaya kita gak perlu attach token manual di setiap axios.get/post
// - Token otomatis ter-attach kalau user sudah login
// - Lebih clean dan DRY (Don't Repeat Yourself)
axios.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage (disimpan saat login)
    const token = localStorage.getItem('cms_token');
    
    // Kalau ada token, attach ke header Authorization
    if (token) {
      // Attach token untuk request ke CMS (kecuali login, karena login gak butuh token)
      // Format header: "Authorization: Bearer <token>"
      if (config.url?.includes('/api/cms') && !config.url?.includes('/api/cms/auth/login')) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Attach token untuk request ke /api/dosen
      // Ini penting! Supaya admin bisa lihat NIP dan telepon dosen
      // Kalau gak ada token, backend akan return data terbatas (tanpa NIP)
      if (config.url?.includes('/api/dosen')) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Return config yang sudah dimodifikasi (dengan token di header)
    return config;
  },
  (error) => {
    // Kalau ada error sebelum request dikirim, reject promise
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
// Interceptor ini jalan SETELAH response diterima dari server
// Fungsinya: handle error 401 (Unauthorized) - auto logout kalau token invalid
//
// Kenapa perlu ini?
// - Kalau token expired atau invalid, backend akan return 401
// - Kita auto logout user dan redirect ke login page
// - User experience lebih baik, gak perlu manual logout
axios.interceptors.response.use(
  (response) => {
    // Kalau response sukses, langsung return (gak perlu diubah)
    return response;
  },
  (error) => {
    // Kalau ada error response dengan status 401 (Unauthorized)
    // Artinya token invalid/expired, jadi kita logout user
    if (error.response?.status === 401 && error.config?.url?.includes('/api/cms')) {
      // Hapus token dan user info dari localStorage
      localStorage.removeItem('cms_token');
      localStorage.removeItem('cms_user');
      
      // Redirect ke login page (kalau user sedang di halaman CMS)
      // Cek dulu apakah user sedang di halaman CMS dan bukan di login page
      if (window.location.pathname.startsWith('/cms') && !window.location.pathname.includes('/login')) {
        window.location.href = '/cms/login';
      }
    }
    
    // Reject promise supaya error bisa di-handle di component
    return Promise.reject(error);
  }
);

// Export axios instance yang sudah dikonfigurasi
// File lain yang import axios dari sini akan otomatis pakai interceptor ini
export default axios;
