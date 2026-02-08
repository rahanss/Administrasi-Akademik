// Komponen untuk menampilkan success message
// Mengikuti prinsip HCI: feedback yang positif untuk user actions

import React from 'react';
import './SuccessMessage.css';

/**
 * Komponen untuk menampilkan success message
 * @param {string} message - Pesan success yang akan ditampilkan
 * @param {boolean} dismissible - Apakah message bisa di-dismiss
 * @param {function} onDismiss - Callback saat message di-dismiss
 * @param {number} autoHide - Auto hide setelah beberapa detik (0 = tidak auto hide)
 */
const SuccessMessage = ({ message, dismissible = true, onDismiss, autoHide = 0 }) => {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (autoHide > 0 && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onDismiss) onDismiss();
      }, autoHide * 1000);
      return () => clearTimeout(timer);
    }
  }, [autoHide, visible, onDismiss]);

  if (!message || !visible) return null;

  return (
    <div 
      className="success-message" 
      role="status"
      aria-live="polite"
    >
      <div className="success-message-content">
        <span className="success-icon" aria-hidden="true">✓</span>
        <span className="success-text">{message}</span>
        {dismissible && onDismiss && (
          <button
            className="success-dismiss"
            onClick={() => {
              setVisible(false);
              onDismiss();
            }}
            aria-label="Tutup pesan sukses"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessMessage;
