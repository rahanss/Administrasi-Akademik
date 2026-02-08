// Komponen untuk menampilkan error message dengan styling yang konsisten
// Mengikuti prinsip HCI: feedback yang jelas dan actionable

import React from 'react';
import './ErrorMessage.css';

/**
 * Komponen untuk menampilkan error message
 * @param {string} message - Pesan error yang akan ditampilkan
 * @param {boolean} dismissible - Apakah error bisa di-dismiss
 * @param {function} onDismiss - Callback saat error di-dismiss
 */
const ErrorMessage = ({ message, dismissible = false, onDismiss }) => {
  if (!message) return null;

  return (
    <div 
      className="error-message" 
      role="alert"
      aria-live="assertive"
    >
      <div className="error-message-content">
        <span className="error-icon" aria-hidden="true">⚠</span>
        <span className="error-text">{message}</span>
        {dismissible && onDismiss && (
          <button
            className="error-dismiss"
            onClick={onDismiss}
            aria-label="Tutup pesan error"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
