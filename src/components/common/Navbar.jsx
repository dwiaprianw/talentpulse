import React from 'react';
import { Sparkles, LayoutDashboard, Globe, Send, Users, ShieldCheck, Compass, LogOut } from 'lucide-react';
import { useAuth } from '../../services/AuthContext';

export default function Navbar({
  currentView = 'public',
  onViewChange = () => {},
  onOpenInquiry = () => {},
  onOpenLoginModal = () => {},
  activeSection = 'talents'
}) {
  const { currentUser, userRole, isAuthenticated, logout } = useAuth();

  const handleCrmClick = () => {
    if (isAuthenticated) {
      onViewChange('crm');
    } else {
      onOpenLoginModal();
    }
  };

  const roleBadgeStyle =
    userRole === 'admin'
      ? { bg: '#F3E8FF', color: '#6B21A8', border: '#D8B4FE', label: '👑 Super Admin' }
      : userRole === 'manager'
      ? { bg: '#DBEAFE', color: '#1E40AF', border: '#93C5FD', label: '🛡️ Account Manager' }
      : null;

  return (
    <header
      style={{
        borderBottom: '1px solid var(--color-border-medium)',
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)',
        transition: 'all var(--transition-normal)'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '76px',
          gap: '20px'
        }}
      >
        {/* Brand Logo & Title */}
        <div
          onClick={() => onViewChange('public')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--color-accent-purple) 0%, var(--color-accent-pink) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(139, 92, 246, 0.35)',
              flexShrink: 0
            }}
          >
            <Sparkles size={22} color="#FFFFFF" />
          </div>
          <div>
            <div
              className="font-heading"
              style={{
                fontSize: '1.3rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                color: 'var(--color-text-primary)'
              }}
            >
              TALENT<span className="text-gradient-purple-pink">PULSE</span>
            </div>
            <span
              style={{
                display: 'block',
                fontSize: '0.68rem',
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 600,
                marginTop: '1px'
              }}
            >
              {currentView === 'crm' ? 'Internal Agency Portal' : 'Creative Talent & Production'}
            </span>
          </div>
        </div>

        {/* PUBLIC VIEW NAVIGATION LINKS */}
        {currentView === 'public' ? (
          <>
            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px'
              }}
            >
              <a
                href="#talents-catalog"
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: activeSection === 'talents' ? 'var(--color-accent-purple-light)' : 'var(--color-text-secondary)',
                  transition: 'color var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-purple-light)')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    activeSection === 'talents' ? 'var(--color-accent-purple-light)' : 'var(--color-text-secondary)')
                }
              >
                <Users size={16} /> Roster
              </a>
              <a
                href="#agency-highlights"
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                  transition: 'color var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-purple-light)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
              >
                <Compass size={16} /> Capabilities
              </a>
              <a
                href="#booking-cta"
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                  transition: 'color var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-purple-light)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
              >
                <ShieldCheck size={16} /> Guarantee
              </a>
            </nav>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button
                type="button"
                onClick={onOpenInquiry}
                className="btn btn-outline btn-sm"
              >
                <Send size={14} /> Submit Brief
              </button>

              {/* Display CRM Button ONLY when user is already logged in / authenticated */}
              {isAuthenticated && roleBadgeStyle && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={handleCrmClick}
                    className="btn btn-primary btn-sm"
                    style={{ gap: '6px', background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)' }}
                  >
                    <LayoutDashboard size={14} /> Agency CRM
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      onViewChange('public');
                    }}
                    className="btn-icon"
                    title="Keluar / Logout"
                    style={{ padding: '6px' }}
                  >
                    <LogOut size={16} color="#BE123C" />
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* AGENCY CRM PORTAL HEADER CONTROLS */
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* User Role Badge */}
            {isAuthenticated && roleBadgeStyle && (
              <span
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  background: roleBadgeStyle.bg,
                  color: roleBadgeStyle.color,
                  border: `1px solid ${roleBadgeStyle.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {roleBadgeStyle.label}
              </span>
            )}

            {/* Separate Public Site Switcher */}
            <button
              type="button"
              onClick={() => onViewChange('public')}
              className="btn btn-outline btn-sm"
              style={{ gap: '6px' }}
            >
              <Globe size={14} /> Public Showcase Page
            </button>

            {/* Logout Button */}
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => {
                  logout();
                  onViewChange('public');
                }}
                className="btn btn-secondary btn-sm"
                style={{ gap: '6px', color: '#BE123C' }}
              >
                <LogOut size={14} /> Logout
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
