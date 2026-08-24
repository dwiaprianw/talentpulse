import React, { useState } from 'react';
import { X, ShieldCheck, KeyRound, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../services/AuthContext';

export default function AdminLoginModal({
  isOpen = false,
  onClose = () => {},
  onSuccess = () => {}
}) {
  const { login } = useAuth();
  const [loginMethod, setLoginMethod] = useState('pin'); // 'pin' | 'email'
  const [pinInput, setPinInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (loginMethod === 'pin') {
        if (!pinInput.trim()) {
          throw new Error('Masukkan PIN keamanan.');
        }
        await login({ pin: pinInput.trim() });
      } else {
        if (!emailInput.trim()) {
          throw new Error('Masukkan email pengguna.');
        }
        await login({ email: emailInput.trim(), password: passwordInput.trim() });
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login gagal. Silakan periksa PIN atau kredensial Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel animate-scale-in"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '32px',
          background: '#FFFFFF',
          border: '1px solid var(--color-border-medium)',
          boxShadow: 'var(--shadow-xl)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--color-accent-blue) 0%, var(--color-accent-purple) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="font-heading" style={{ fontSize: '1.35rem', color: 'var(--color-text-primary)' }}>
                Autentikasi Agency CRM
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem' }}>
                Akses khusus staf terotentikasi (RBAC)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-icon"
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className="animate-slide-up"
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: '#FFE4E6',
              border: '1px solid #FECDD3',
              color: '#BE123C',
              fontSize: '0.86rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '18px'
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Method Switcher Pills */}
        <div
          style={{
            background: '#F1F5F9',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            gap: '4px',
            marginBottom: '20px'
          }}
        >
          <button
            type="button"
            onClick={() => {
              setLoginMethod('pin');
              setError(null);
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: loginMethod === 'pin' ? '#FFFFFF' : 'transparent',
              color: loginMethod === 'pin' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              border: 'none',
              boxShadow: loginMethod === 'pin' ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer'
            }}
          >
            <KeyRound size={14} style={{ display: 'inline', marginRight: '6px' }} /> Security PIN
          </button>

          <button
            type="button"
            onClick={() => {
              setLoginMethod('email');
              setError(null);
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: loginMethod === 'email' ? '#FFFFFF' : 'transparent',
              color: loginMethod === 'email' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              border: 'none',
              boxShadow: loginMethod === 'email' ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer'
            }}
          >
            <Mail size={14} style={{ display: 'inline', marginRight: '6px' }} /> Email & Password
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loginMethod === 'pin' ? (
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Masukkan PIN Keamanan *
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="password"
                  maxLength={10}
                  placeholder="••••"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="glass-input"
                  style={{ paddingLeft: '42px', letterSpacing: '0.3em', fontSize: '1.2rem', fontWeight: 800 }}
                  autoFocus
                />
              </div>
            </div>
          ) : (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                  Email Pengguna *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input
                    type="email"
                    placeholder="email@agency.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="glass-input"
                    style={{ paddingLeft: '38px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                  Kata Sandi *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="glass-input"
                    style={{ paddingLeft: '38px' }}
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '8px' }}
          >
            {loading ? (
              <span className="animate-pulse-glow">Verifikasi...</span>
            ) : (
              <>
                Masuk ke Admin CRM <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
