// Utility untuk validasi form di frontend
// Memberikan feedback yang cepat ke user sebelum submit ke backend

/**
 * Validasi email format
 * @param {string} email - Email yang akan divalidasi
 * @returns {object} - { valid: boolean, message: string }
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, message: 'Email harus diisi' };
  }
  
  const trimmedEmail = email.trim();
  if (trimmedEmail.length === 0) {
    return { valid: false, message: 'Email harus diisi' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, message: 'Format email tidak valid' };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validasi required field
 * @param {string} value - Value yang akan divalidasi
 * @param {string} fieldName - Nama field (untuk error message)
 * @returns {object} - { valid: boolean, message: string }
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return { valid: false, message: `${fieldName} harus diisi` };
  }
  return { valid: true, message: '' };
};

/**
 * Validasi panjang string
 * @param {string} value - String yang akan divalidasi
 * @param {number} min - Panjang minimum
 * @param {number} max - Panjang maksimum
 * @param {string} fieldName - Nama field (untuk error message)
 * @returns {object} - { valid: boolean, message: string }
 */
export const validateLength = (value, min, max, fieldName = 'Field') => {
  if (typeof value !== 'string') {
    return { valid: false, message: `${fieldName} harus berupa teks` };
  }
  
  const length = value.trim().length;
  
  if (length < min) {
    return { valid: false, message: `${fieldName} minimal ${min} karakter` };
  }
  
  if (length > max) {
    return { valid: false, message: `${fieldName} maksimal ${max} karakter` };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validasi URL format
 * @param {string} url - URL yang akan divalidasi
 * @returns {object} - { valid: boolean, message: string }
 */
export const validateURL = (url) => {
  if (!url || typeof url !== 'string') {
    return { valid: false, message: 'URL harus diisi' };
  }
  
  try {
    new URL(url);
    return { valid: true, message: '' };
  } catch {
    return { valid: false, message: 'Format URL tidak valid' };
  }
};

/**
 * Validasi nomor (integer atau float)
 * @param {string|number} value - Value yang akan divalidasi
 * @param {object} options - { min, max, integer: boolean }
 * @returns {object} - { valid: boolean, message: string }
 */
export const validateNumber = (value, options = {}) => {
  const { min, max, integer = false } = options;
  
  if (value === '' || value === null || value === undefined) {
    return { valid: false, message: 'Nomor harus diisi' };
  }
  
  const num = Number(value);
  
  if (isNaN(num)) {
    return { valid: false, message: 'Harus berupa nomor' };
  }
  
  if (integer && !Number.isInteger(num)) {
    return { valid: false, message: 'Harus berupa bilangan bulat' };
  }
  
  if (min !== undefined && num < min) {
    return { valid: false, message: `Minimal ${min}` };
  }
  
  if (max !== undefined && num > max) {
    return { valid: false, message: `Maksimal ${max}` };
  }
  
  return { valid: true, message: '' };
};
