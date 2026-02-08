// Komponen Loading Spinner yang konsisten
// Mengikuti prinsip HCI: visibility of system status
// Menggantikan Loading.js untuk konsistensi

import React from 'react';
import './LoadingSpinner.css';

/**
 * Komponen Loading Spinner
 * @param {string} message - Pesan yang ditampilkan saat loading
 * @param {string} size - Ukuran spinner: 'small', 'medium', 'large' (default: 'medium')
 * @param {boolean} fullScreen - Apakah loading full screen
 */
const LoadingSpinner = ({ 
  message = 'Memuat...', 
  size = 'medium',
  fullScreen = false 
}) => {
  const containerClass = fullScreen 
    ? 'loading-spinner-container loading-spinner-fullscreen'
    : 'loading-spinner-container';
  
  return (
    <div 
      className={containerClass} 
      role="status" 
      aria-live="polite"
      aria-label={message}
    >
      <div 
        className={`loading-spinner loading-spinner-${size}`} 
        aria-hidden="true"
      >
        <div className="spinner-circle"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
