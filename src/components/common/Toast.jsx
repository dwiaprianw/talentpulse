import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

/**
 * Toast Notification Item Component
 */
function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onDismiss(toast.id);
      }, toast.duration || 4500);
      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  const icons = {
    success: <CheckCircle size={20} color="#34D399" />,
    error: <AlertCircle size={20} color="#FB7185" />,
    warning: <AlertTriangle size={20} color="#FBBF24" />,
    info: <Info size={20} color="#60A5FA" />
  };

  const borderColors = {
    success: 'rgba(16, 185, 129, 0.4)',
    error: 'rgba(244, 63, 94, 0.4)',
    warning: 'rgba(245, 158, 11, 0.4)',
    info: 'rgba(59, 130, 246, 0.4)'
  };

  const glowShadows = {
    success: '0 8px 24px rgba(16, 185, 129, 0.25)',
    error: '0 8px 24px rgba(244, 63, 94, 0.25)',
    warning: '0 8px 24px rgba(245, 158, 11, 0.25)',
    info: '0 8px 24px rgba(59, 130, 246, 0.25)'
  };

  const type = toast.type || 'info';

  return (
    <div
      role="alert"
      className="animate-slide-up"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${borderColors[type] || borderColors.info}`,
        boxShadow: glowShadows[type] || glowShadows.info,
        borderRadius: 'var(--radius-lg)',
        padding: '14px 18px',
        minWidth: '320px',
        maxWidth: '440px',
        color: 'var(--color-text-primary)',
        pointerEvents: 'auto',
        position: 'relative'
      }}
    >
      <div style={{ flexShrink: 0, marginTop: '2px' }}>
        {icons[type] || icons.info}
      </div>
      <div style={{ flex: 1 }}>
        {toast.title && (
          <h4
            style={{
              fontSize: '0.95rem',
              fontWeight: 600,
              marginBottom: '2px',
              color: 'var(--color-text-primary)'
            }}
          >
            {toast.title}
          </h4>
        )}
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.45,
            margin: 0
          }}
        >
          {toast.message}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Close notification"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-text-muted)',
          cursor: 'pointer',
          padding: '2px',
          borderRadius: 'var(--radius-xs)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color var(--transition-fast)'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
      >
        <X size={16} />
      </button>
    </div>
  );
}

/**
 * Toast Container Manager
 */
export default function Toast({ toasts = [], onDismiss = () => {} }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
