/**
 * Accessibility utilities and helpers
 */

/**
 * Generate unique IDs for form elements and ARIA attributes
 */
export const generateId = (prefix = 'id') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Manage focus for keyboard navigation
 */
export class FocusManager {
  constructor() {
    this.focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');
  }

  getFocusableElements(container = document) {
    return Array.from(container.querySelectorAll(this.focusableSelectors));
  }

  getFirstFocusable(container = document) {
    return container.querySelector(this.focusableSelectors);
  }

  getLastFocusable(container = document) {
    const elements = this.getFocusableElements(container);
    return elements[elements.length - 1];
  }

  trapFocus(container, event) {
    const focusableElements = this.getFocusableElements(container);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    }
  }

  restoreFocus(element) {
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  }
}

/**
 * Screen reader announcements
 */
export class ScreenReaderAnnouncer {
  constructor() {
    this.liveRegion = null;
    this.createLiveRegion();
  }

  createLiveRegion() {
    if (this.liveRegion) return;

    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.setAttribute('class', 'sr-only');
    this.liveRegion.style.cssText = `
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    `;
    document.body.appendChild(this.liveRegion);
  }

  announce(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();

    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = message;

    // Clear after announcement
    setTimeout(() => {
      if (this.liveRegion) {
        this.liveRegion.textContent = '';
      }
    }, 1000);
  }

  announceImmediate(message) {
    this.announce(message, 'assertive');
  }
}

// Global instances
export const focusManager = new FocusManager();
export const screenReader = new ScreenReaderAnnouncer();

/**
 * Keyboard navigation helpers
 */
export const KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  TAB: 'Tab',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
};

/**
 * Handle keyboard navigation for lists and menus
 */
export const handleArrowNavigation = (event, items, currentIndex, onSelect) => {
  let newIndex = currentIndex;

  switch (event.key) {
    case KEYS.ARROW_UP:
      event.preventDefault();
      newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      break;
    case KEYS.ARROW_DOWN:
      event.preventDefault();
      newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      break;
    case KEYS.HOME:
      event.preventDefault();
      newIndex = 0;
      break;
    case KEYS.END:
      event.preventDefault();
      newIndex = items.length - 1;
      break;
    case KEYS.ENTER:
    case KEYS.SPACE:
      event.preventDefault();
      onSelect?.(currentIndex);
      return currentIndex;
    default:
      return currentIndex;
  }

  // Focus the new item
  const newItem = items[newIndex];
  if (newItem && typeof newItem.focus === 'function') {
    newItem.focus();
  }

  return newIndex;
};

/**
 * ARIA attributes helpers
 */
export const getAriaAttributes = (props) => {
  const ariaProps = {};
  
  Object.keys(props).forEach(key => {
    if (key.startsWith('aria-') || key === 'role') {
      ariaProps[key] = props[key];
    }
  });

  return ariaProps;
};

/**
 * Color contrast utilities
 */
export const getContrastRatio = (color1, color2) => {
  const getLuminance = (color) => {
    const rgb = color.match(/\d+/g);
    if (!rgb) return 0;
    
    const [r, g, b] = rgb.map(c => {
      c = parseInt(c) / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

export const meetsWCAGAA = (color1, color2) => {
  return getContrastRatio(color1, color2) >= 4.5;
};

export const meetsWCAGAAA = (color1, color2) => {
  return getContrastRatio(color1, color2) >= 7;
};

import { useEffect, useRef, useState } from 'react';

/**
 * React hooks for accessibility
 */

/**
 * Hook for managing focus trap in modals/dialogs
 */
export const useFocusTrap = (isActive = false) => {
  const containerRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Store the previously focused element
    previousFocusRef.current = document.activeElement;

    // Focus the first focusable element in the container
    const firstFocusable = focusManager.getFirstFocusable(containerRef.current);
    if (firstFocusable) {
      firstFocusable.focus();
    }

    const handleKeyDown = (event) => {
      if (event.key === KEYS.TAB) {
        focusManager.trapFocus(containerRef.current, event);
      }
      if (event.key === KEYS.ESCAPE) {
        // Allow parent components to handle escape
        event.stopPropagation();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Restore focus to the previously focused element
      if (previousFocusRef.current) {
        focusManager.restoreFocus(previousFocusRef.current);
      }
    };
  }, [isActive]);

  return containerRef;
};

/**
 * Hook for screen reader announcements
 */
export const useAnnouncer = () => {
  const announce = (message, priority = 'polite') => {
    screenReader.announce(message, priority);
  };

  const announceImmediate = (message) => {
    screenReader.announceImmediate(message);
  };

  return { announce, announceImmediate };
};

/**
 * Hook for keyboard navigation in lists
 */
export const useKeyboardNavigation = (items = [], onSelect) => {
  const [currentIndex, setCurrentIndex] = useState(-1);

  const handleKeyDown = (event) => {
    const newIndex = handleArrowNavigation(event, items, currentIndex, onSelect);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  const resetIndex = () => setCurrentIndex(-1);

  return {
    currentIndex,
    setCurrentIndex,
    handleKeyDown,
    resetIndex,
  };
};

/**
 * Hook for managing ARIA live regions
 */
export const useLiveRegion = () => {
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('polite');

  const announce = (newMessage, newPriority = 'polite') => {
    setMessage(newMessage);
    setPriority(newPriority);
    
    // Clear message after announcement
    setTimeout(() => setMessage(''), 1000);
  };

  return {
    message,
    priority,
    announce,
    liveRegionProps: {
      'aria-live': priority,
      'aria-atomic': 'true',
      className: 'sr-only',
      children: message,
    },
  };
};

/**
 * Hook for reduced motion preference
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

export default {
  generateId,
  FocusManager,
  ScreenReaderAnnouncer,
  focusManager,
  screenReader,
  KEYS,
  handleArrowNavigation,
  getAriaAttributes,
  getContrastRatio,
  meetsWCAGAA,
  meetsWCAGAAA,
  useFocusTrap,
  useAnnouncer,
  useKeyboardNavigation,
  useLiveRegion,
  useReducedMotion,
};