// Utility untuk keyboard navigation
// Mengikuti prinsip HCI: keyboard accessibility dan shortcut keys

/**
 * Handle keyboard navigation untuk list items
 * @param {KeyboardEvent} e - Keyboard event
 * @param {Array} items - Array items yang bisa di-navigate
 * @param {number} currentIndex - Index item saat ini
 * @param {function} onNavigate - Callback saat navigate (index)
 * @param {function} onSelect - Callback saat select item (index)
 */
export const handleListNavigation = (e, items, currentIndex, onNavigate, onSelect) => {
  const { key } = e;
  
  switch (key) {
    case 'ArrowDown':
      e.preventDefault();
      if (currentIndex < items.length - 1) {
        onNavigate(currentIndex + 1);
      }
      break;
      
    case 'ArrowUp':
      e.preventDefault();
      if (currentIndex > 0) {
        onNavigate(currentIndex - 1);
      }
      break;
      
    case 'Home':
      e.preventDefault();
      onNavigate(0);
      break;
      
    case 'End':
      e.preventDefault();
      onNavigate(items.length - 1);
      break;
      
    case 'Enter':
    case ' ':
      e.preventDefault();
      if (currentIndex >= 0 && currentIndex < items.length) {
        onSelect(currentIndex);
      }
      break;
      
    default:
      break;
  }
};

/**
 * Handle escape key untuk close modal/dropdown
 * @param {KeyboardEvent} e - Keyboard event
 * @param {function} onClose - Callback saat escape ditekan
 */
export const handleEscape = (e, onClose) => {
  if (e.key === 'Escape' && onClose) {
    e.preventDefault();
    onClose();
  }
};

/**
 * Trap focus dalam modal (accessibility)
 * @param {HTMLElement} container - Container element (modal)
 * @param {KeyboardEvent} e - Keyboard event
 */
export const trapFocus = (container, e) => {
  if (e.key !== 'Tab') return;
  
  const focusableElements = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  if (e.shiftKey) {
    // Shift + Tab
    if (document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    }
  } else {
    // Tab
    if (document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
};
