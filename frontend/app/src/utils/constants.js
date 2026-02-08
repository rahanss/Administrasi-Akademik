// Constants untuk konsistensi di seluruh aplikasi

// API Endpoints
export const API_ENDPOINTS = {
  // Public APIs
  BERITA: '/api/berita',
  DOSEN: '/api/dosen',
  PRODI: '/api/prodi',
  MATA_KULIAH: '/api/mata-kuliah',
  JADWAL: '/api/jadwal',
  LAYANAN: '/api/layanan',
  HALAMAN: '/api/halaman',
  MENU: '/api/menu',
  
  // CMS APIs
  CMS_AUTH_LOGIN: '/api/cms/auth/login',
  CMS_AUTH_ME: '/api/cms/auth/me',
  CMS_AUTH_LOGOUT: '/api/cms/auth/logout',
  CMS_BERITA: '/api/cms/berita',
  CMS_HALAMAN: '/api/cms/halaman',
  CMS_LAYANAN: '/api/cms/layanan',
  CMS_DOSEN: '/api/cms/dosen',
  CMS_PRODI: '/api/cms/prodi',
  CMS_MATA_KULIAH: '/api/cms/mata-kuliah',
  CMS_KATEGORI: '/api/cms/kategori',
  CMS_MENU: '/api/cms/menu',
  CMS_KOORDINATOR: '/api/cms/koordinator',
  CMS_DOSEN_PI: '/api/cms/dosen-pembimbing-pi',
  CMS_JADWAL_KELAS: '/api/cms/jadwal-kelas',
  CMS_JADWAL_KULIAH: '/api/cms/jadwal-kuliah',
  CMS_JADWAL_UJIAN: '/api/cms/jadwal-ujian'
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  CMS_TOKEN: 'cms_token',
  CMS_USER: 'cms_user'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
};

// Validation Limits
export const VALIDATION_LIMITS = {
  USERNAME_MIN: 3,
  USERNAME_MAX: 50,
  PASSWORD_MIN: 6,
  PASSWORD_MAX: 100,
  EMAIL_MAX: 255,
  TITLE_MAX: 200,
  SLUG_MAX: 200,
  CONTENT_MAX: 50000
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_FULL: 'dddd, DD MMMM YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm'
};

// Error Messages (User-friendly)
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
  UNAUTHORIZED: 'Sesi Anda telah berakhir. Silakan login kembali.',
  FORBIDDEN: 'Anda tidak memiliki izin untuk melakukan aksi ini.',
  NOT_FOUND: 'Data yang dicari tidak ditemukan.',
  SERVER_ERROR: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
  VALIDATION_ERROR: 'Data yang dikirim tidak valid. Silakan periksa kembali.',
  GENERIC: 'Terjadi kesalahan. Silakan coba lagi.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Data berhasil dibuat.',
  UPDATED: 'Data berhasil di-update.',
  DELETED: 'Data berhasil dihapus.',
  SAVED: 'Data berhasil disimpan.',
  LOGIN: 'Login berhasil.',
  LOGOUT: 'Logout berhasil.'
};
