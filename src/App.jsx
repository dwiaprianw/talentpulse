import React, { useState, useEffect } from 'react';
import { fetchStats } from './services/api';
import { Sparkles, Users, Briefcase, Calendar, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

function App() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadInitialStats() {
      try {
        setLoading(true);
        const data = await fetchStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load stats:', err);
        setError(err.message || 'Could not connect to API server');
      } finally {
        setLoading(false);
      }
    }

    loadInitialStats();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
      <header
        style={{
          borderBottom: '1px solid var(--color-border-subtle)',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '72px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--color-accent-purple) 0%, var(--color-accent-pink) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-glow-purple)'
              }}
            >
              <Sparkles size={22} color="#FFFFFF" />
            </div>
            <div>
              <span className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                TALENT<span className="text-gradient-purple-pink">PULSE</span>
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.7rem',
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  lineHeight: 1
                }}
              >
                Creative Agency CRM
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="badge badge-available">
              <CheckCircle size={12} /> System Ready
            </span>
          </div>
        </div>
      </header>

      {/* Hero / Overview Banner */}
      <main className="container" style={{ flex: 1, padding: '40px 24px' }}>
        <div style={{ maxWidth: '800px', marginBottom: '40px' }} className="animate-slide-up">
          <div
            className="badge badge-tag"
            style={{ marginBottom: '16px', display: 'inline-flex', padding: '6px 14px' }}
          >
            ✨ Vibrant Creative Studio Design System
          </div>
          <h1
            style={{
              fontSize: '2.75rem',
              lineHeight: 1.15,
              marginBottom: '16px'
            }}
          >
            Empowering Next-Gen <span className="text-gradient-vibrant">Creator Collaborations</span>
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Unified talent roster management, real-time client booking pipeline, master production calendar,
            and interactive marketing showcase.
          </p>
        </div>

        {/* Stats Grid Showcase */}
        <section style={{ marginBottom: '48px' }} className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.35rem' }}>Platform Metrics</h2>
            {loading && <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Loading live data...</span>}
            {error && <span style={{ fontSize: '0.85rem', color: 'var(--color-accent-rose)' }}>Offline preview mode</span>}
          </div>

          <div className="grid-responsive">
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Active Talents</span>
                <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--color-accent-purple-light)' }}>
                  <Users size={20} />
                </div>
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                {stats ? stats.activeTalents : (loading ? '—' : '5')}
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--color-accent-emerald-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={14} /> Ready for brand placement
              </div>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Active Campaigns</span>
                <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--color-accent-blue-light)' }}>
                  <Briefcase size={20} />
                </div>
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                {stats ? stats.activeProjects : (loading ? '—' : '6')}
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--color-accent-blue-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Across Kanban stages
              </div>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Pending Leads</span>
                <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', background: 'rgba(236, 72, 153, 0.15)', color: 'var(--color-accent-pink)' }}>
                  <Sparkles size={20} />
                </div>
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                {stats ? stats.pendingLeads : (loading ? '—' : '2')}
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--color-accent-pink)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Inbound client inquiries
              </div>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Shoots This Week</span>
                <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--color-accent-amber-light)' }}>
                  <Calendar size={20} />
                </div>
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                {stats ? stats.weekShoots : (loading ? '—' : '3')}
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--color-accent-amber-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Master calendar bookings
              </div>
            </div>
          </div>
        </section>

        {/* Feature Modules Overview Card */}
        <section className="glass-panel" style={{ padding: '32px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Frontend Scaffolding & Design System Operational</h3>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: '650px' }}>
                React 18 + Vite 6 + Lucide Icons environment initialized with Vibrant Creative Studio styling,
                dynamic glassmorphic components, keyframe micro-animations, and complete API service integration.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-primary">
                View Showcase <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border-subtle)',
          padding: '24px 0',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: '0.85rem'
        }}
      >
        <div className="container">
          TalentPulse CRM & Marketing Showcase Platform &copy; 2026. Built with Vite & React.
        </div>
      </footer>
    </div>
  );
}

export default App;
