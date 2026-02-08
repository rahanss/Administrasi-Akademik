// Utility untuk handle error dengan konsisten
// Mengikuti prinsip HCI: berikan feedback yang jelas dan actionable

/**
 * Format error message untuk ditampilkan ke user
 * @param {Error} error - Error object dari axios atau error lainnya
 * @returns {string} - Pesan error yang user-friendly
 */
export const getErrorMessage = (error) => {
  // Jika error dari axios (network error atau server error)
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.error || error.response.data?.message;
    
    // Custom message berdasarkan status code
    switch (status) {
      case 400:
        return message || 'Data yang dikirim tidak valid. Silakan periksa kembali.';
      case 401:
        return 'Sesi Anda telah berakhir. Silakan login kembali.';
      case 403:
        return 'Anda tidak memiliki izin untuk melakukan aksi ini.';
      case 404:
        return 'Data yang dicari tidak ditemukan.';
      case 409:
        return message || 'Data sudah ada. Silakan gunakan data yang berbeda.';
      case 422:
        return message || 'Data tidak valid. Silakan periksa kembali.';
      case 500:
        return 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';
      default:
        return message || 'Terjadi kesalahan. Silakan coba lagi.';
    }
  }
  
  // Network error (tidak bisa connect ke server)
  if (error.request) {
    return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
  }
  
  // Error lainnya
  return error.message || 'Terjadi kesalahan yang tidak diketahui.';
};

/**
 * Log error untuk debugging (hanya di development)
 * @param {string} context - Konteks dimana error terjadi
 * @param {Error} error - Error object
 */
export const logError = (context, error) => {
  // Hanya log di development mode
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, error);
    if (error.response) {
      console.error('Response:', error.response.data);
      console.error('Status:', error.response.status);
    }
  }
};
