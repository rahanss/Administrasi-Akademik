// Utility untuk validasi input
// Mencegah invalid data masuk ke database

/**
 * Validasi email format
 * @param {string} email - Email yang akan divalidasi
 * @returns {boolean} - True jika valid
 */
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validasi slug format (alphanumeric, dash, underscore)
 * @param {string} slug - Slug yang akan divalidasi
 * @returns {boolean} - True jika valid
 */
const isValidSlug = (slug) => {
  if (!slug || typeof slug !== 'string') return false;
  const slugRegex = /^[a-z0-9-_]+$/;
  return slugRegex.test(slug.toLowerCase());
};

/**
 * Validasi required fields
 * @param {object} data - Data yang akan divalidasi
 * @param {array} requiredFields - Array field yang wajib
 * @returns {object} - { valid: boolean, missing: array }
 */
const validateRequired = (data, requiredFields) => {
  const missing = [];
  
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      missing.push(field);
    }
  }
  
  return {
    valid: missing.length === 0,
    missing
  };
};

/**
 * Sanitize string input (prevent XSS)
 * @param {string} input - Input yang akan di-sanitize
 * @returns {string} - String yang sudah di-sanitize
 */
const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 10000); // Limit length
};

/**
 * Validasi panjang string
 * @param {string} value - String yang akan divalidasi
 * @param {number} min - Panjang minimum
 * @param {number} max - Panjang maksimum
 * @returns {boolean} - True jika valid
 */
const validateLength = (value, min, max) => {
  if (typeof value !== 'string') return false;
  const length = value.trim().length;
  return length >= min && length <= max;
};

/**
 * Validasi nomor telepon Indonesia
 * @param {string} phone - Nomor telepon yang akan divalidasi
 * @returns {boolean} - True jika valid
 */
const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  // Format: +62 atau 08 atau (021)
  const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
  return phoneRegex.test(phone.replace(/[\s-()]/g, ''));
};

/**
 * Validasi NIP (Nomor Induk Pegawai)
 * @param {string} nip - NIP yang akan divalidasi
 * @returns {boolean} - True jika valid
 */
const isValidNIP = (nip) => {
  if (!nip || typeof nip !== 'string') return false;
  // NIP biasanya 18 digit
  const nipRegex = /^[0-9]{15,20}$/;
  return nipRegex.test(nip);
};

module.exports = {
  isValidEmail,
  isValidSlug,
  validateRequired,
  sanitizeString,
  validateLength,
  isValidPhone,
  isValidNIP
};
