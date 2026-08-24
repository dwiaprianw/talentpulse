import React from 'react';
import { Sparkles, LayoutDashboard, Globe, Send, Users, ShieldCheck, Compass } from 'lucide-react';

export default function Navbar({
  currentView = 'public',
  onViewChange = () => {},
  onOpenInquiry = () => {},
  activeSection = 'talents'
}) {
  return (
    <header
      style={{
        borderBottom: '1px solid var(--color-border-subtle)',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
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
              boxShadow: 'var(--shadow-glow-purple)',
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
                lineHeight: 1.1
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
              Creative Talent & CRM Suite
            </span>
          </div>
        </div>

        {/* Public View Navigation Links (when on public showcase) */}
        {currentView === 'public' && (
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
                fontWeight: 500,
                color: activeSection === 'talents' ? 'var(--color-accent-purple-light)' : 'var(--color-text-secondary)',
                transition: 'color var(--transition-fast)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
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
                fontWeight: 500,
                color: 'var(--color-text-secondary)',
                transition: 'color var(--transition-fast)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              <Compass size={16} /> Capabilities
            </a>
            <a
              href="#booking-cta"
              style={{
                fontSize: '0.92rem',
                fontWeight: 500,
                color: 'var(--color-text-secondary)',
                transition: 'color var(--transition-fast)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              <ShieldCheck size={16} /> Guarantee
            </a>
          </nav>
        )}

        {/* Action Controls & View Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Quick Book Inquire CTA (on public view) */}
          {currentView === 'public' && (
            <button
              type="button"
              onClick={onOpenInquiry}
              className="btn btn-outline btn-sm"
              style={{ display: 'none', mdDisplay: 'flex' }}
            >
              <Send size={14} /> Submit Brief
            </button>
          )}

          {/* View Switcher Button (Public Showcase vs Agency CRM Portal) */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              padding: '4px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              border: '1px solid var(--color-border-subtle)',
              gap: '4px'
            }}
          >
            <button
              type="button"
              onClick={() => onViewChange('public')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                transition: 'all var(--transition-fast)',
                background: currentView === 'public' ? 'linear-gradient(135deg, var(--color-accent-purple) 0%, var(--color-accent-pink) 100%)' : 'transparent',
                color: currentView === 'public' ? '#FFFFFF' : 'var(--color-text-secondary)',
                boxShadow: currentView === 'public' ? '0 2px 10px rgba(139, 92, 246, 0.35)' : 'none'
              }}
            >
              <Globe size={14} /> Public Showcase
            </button>

            <button
              type="button"
              onClick={() => onViewChange('crm')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                transition: 'all var(--transition-fast)',
                background: currentView === 'crm' ? 'linear-gradient(135deg, var(--color-accent-blue) 0%, var(--color-accent-purple) 100%)' : 'transparent',
                color: currentView === 'crm' ? '#FFFFFF' : 'var(--color-text-secondary)',
                boxShadow: currentView === 'crm' ? '0 2px 10px rgba(59, 130, 246, 0.35)' : 'none'
              }}
            >
              <LayoutDashboard size={14} /> Agency CRM
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
