import React, { useState } from 'react';
import { Sparkles, LayoutDashboard, Globe, Send, Users, ShieldCheck, Compass, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../services/AuthContext';

export default function Navbar({
  currentView = 'public',
  onViewChange = () => {},
  onOpenInquiry = () => {},
  onOpenLoginModal = () => {},
  activeSection = 'talents'
}) {
  const { currentUser, userRole, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCrmClick = () => {
    setMobileMenuOpen(false);
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
          gap: '16px'
        }}
      >
        {/* Brand Logo & Title */}
        <div
          onClick={() => {
            setMobileMenuOpen(false);
            onViewChange('public');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--color-accent-purple) 0%, var(--color-accent-pink) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(139, 92, 246, 0.35)',
              flexShrink: 0
            }}
          >
            <Sparkles size={20} color="#FFFFFF" />
          </div>
          <div>
            <div
              className="font-heading"
              style={{
                fontSize: '1.2rem',
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
                fontSize: '0.64rem',
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontWeight: 600,
                marginTop: '1px'
              }}
            >
              {currentView === 'crm' ? 'Internal CRM Portal' : 'Creative Talent & Production'}
            </span>
          </div>
        </div>

        {/* DESKTOP PUBLIC VIEW NAVIGATION LINKS */}
        {currentView === 'public' && (
          <nav
            className="desktop-nav-links"
            style={{
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
            >
              <ShieldCheck size={16} /> Guarantee
            </a>
          </nav>
        )}

        {/* Desktop Action Controls */}
        <div className="desktop-actions" style={{ alignItems: 'center', gap: '12px' }}>
          {currentView === 'public' ? (
            <>
              <button
                type="button"
                onClick={onOpenInquiry}
                className="btn btn-outline btn-sm"
              >
                <Send size={14} /> Submit Brief
              </button>

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
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

              <button
                type="button"
                onClick={() => onViewChange('public')}
                className="btn btn-outline btn-sm"
                style={{ gap: '6px' }}
              >
                <Globe size={14} /> Public Showcase Page
              </button>

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

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="btn-icon mobile-menu-toggle"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-dropdown-drawer animate-slide-down"
          style={{
            background: '#FFFFFF',
            borderBottom: '1px solid var(--color-border-medium)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          {currentView === 'public' ? (
            <>
              <a
                href="#talents-catalog"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-primary)', padding: '8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Users size={18} color="var(--color-accent-purple)" /> Roster Catalog
              </a>
              <a
                href="#agency-highlights"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-primary)', padding: '8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Compass size={18} color="var(--color-accent-pink)" /> Capabilities
              </a>
              <a
                href="#booking-cta"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-primary)', padding: '8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ShieldCheck size={18} color="#059669" /> Client Guarantee
              </a>

              <div style={{ height: '1px', background: 'var(--color-border-medium)', margin: '4px 0' }} />

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenInquiry();
                }}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Send size={16} /> Submit Campaign Brief
              </button>

              {isAuthenticated && (
                <button
                  type="button"
                  onClick={handleCrmClick}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <LayoutDashboard size={16} /> Enter Agency CRM
                </button>
              )}
            </>
          ) : (
            <>
              {isAuthenticated && roleBadgeStyle && (
                <div style={{ padding: '8px 12px', background: roleBadgeStyle.bg, color: roleBadgeStyle.color, borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.85rem' }}>
                  {roleBadgeStyle.label}
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onViewChange('public');
                }}
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Globe size={16} /> Back to Public Showcase
              </button>

              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    onViewChange('public');
                  }}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', color: '#BE123C' }}
                >
                  <LogOut size={16} /> Logout
                </button>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
}
