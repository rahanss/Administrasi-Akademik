// Komponen untuk menampilkan empty state (tidak ada data)
// Mengikuti prinsip HCI: visibility of system status

import React from 'react';
import './EmptyState.css';

/**
 * Komponen Empty State
 * @param {string} message - Pesan yang ditampilkan
 * @param {string} icon - Icon yang ditampilkan (opsional)
 * @param {React.ReactNode} action - Action button atau link (opsional)
 */
const EmptyState = ({ message = 'Tidak ada data tersedia', icon, action }) => {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      {icon && (
        <div className="empty-state-icon" aria-hidden="true">
          {icon}
        </div>
      )}
      <p className="empty-state-message">{message}</p>
      {action && (
        <div className="empty-state-action">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
