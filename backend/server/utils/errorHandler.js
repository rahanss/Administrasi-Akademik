// Utility untuk handle error dengan konsisten di backend
// Memberikan error response yang user-friendly

/**
 * Format error response untuk client
 * @param {Error} error - Error object
 * @param {object} req - Express request object
 * @returns {object} - Error response object
 */
const formatErrorResponse = (error, req = null) => {
  // Log error untuk debugging (hanya di development)
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: error.message,
      stack: error.stack,
      url: req?.originalUrl,
      method: req?.method
    });
  }

  // Error dari database
  if (error.code === 'ER_DUP_ENTRY') {
    return {
      status: 409,
      error: 'Data sudah ada. Silakan gunakan data yang berbeda.'
    };
  }

  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return {
      status: 400,
      error: 'Data referensi tidak ditemukan. Periksa kembali data yang dikirim.'
    };
  }

  if (error.code === 'ER_BAD_FIELD_ERROR') {
    return {
      status: 400,
      error: 'Field tidak valid. Periksa kembali data yang dikirim.'
    };
  }

  // Error dari JWT
  if (error.name === 'JsonWebTokenError') {
    return {
      status: 401,
      error: 'Token tidak valid.'
    };
  }

  if (error.name === 'TokenExpiredError') {
    return {
      status: 401,
      error: 'Token telah kadaluarsa. Silakan login kembali.'
    };
  }

  // Error dari validasi
  if (error.name === 'ValidationError') {
    return {
      status: 400,
      error: error.message || 'Data tidak valid.'
    };
  }

  // Default error
  return {
    status: error.status || 500,
    error: error.message || 'Terjadi kesalahan pada server.'
  };
};

/**
 * Send error response ke client
 * @param {object} res - Express response object
 * @param {Error} error - Error object
 * @param {object} req - Express request object (optional)
 */
const sendErrorResponse = (res, error, req = null) => {
  const { status, error: errorMessage } = formatErrorResponse(error, req);
  res.status(status).json({ error: errorMessage });
};

/**
 * Create custom error
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @returns {Error} - Error object dengan status
 */
const createError = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  error.name = 'ValidationError';
  return error;
};

module.exports = {
  formatErrorResponse,
  sendErrorResponse,
  createError
};
