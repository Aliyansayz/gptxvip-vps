import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  type?: 'success' | 'error' | 'info';
  isDark?: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  visible,
  onClose,
  type = 'success',
  isDark = false,
}) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  const colors = {
    success: { bg: isDark ? '#064e3b' : '#f0fdf4', border: isDark ? '#065f46' : '#bbf7d0', icon: '#10b981', text: isDark ? '#d1fae5' : '#064e3b' },
    error: { bg: isDark ? '#7f1d1d' : '#fef2f2', border: isDark ? '#991b1b' : '#fecaca', icon: '#ef4444', text: isDark ? '#fecaca' : '#991b1b' },
    info: { bg: isDark ? '#1e3a5f' : '#eff6ff', border: isDark ? '#1e40af' : '#bfdbfe', icon: '#3b82f6', text: isDark ? '#bfdbfe' : '#1e3a5f' },
  };

  const c = colors[type];

  return (
    <div
      className="toast-box show fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded shadow-lg font-sans text-xs"
      style={{
        backgroundColor: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
      }}
      role="alert"
      aria-live="polite"
    >
      <CheckCircle className="flex-shrink-0" style={{ color: c.icon }} size={16} />
      <span id="toast-msg">{message}</span>
    </div>
  );
};