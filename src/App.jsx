import React, { useState, useEffect, useCallback } from 'react';
import { fetchTalents, fetchStats } from './services/api';
import Navbar from './components/common/Navbar';
import Toast from './components/common/Toast';
import HeroBanner from './components/public/HeroBanner';
import TalentCatalog from './components/public/TalentCatalog';
import TalentDetailModal from './components/public/TalentDetailModal';
import BookingInquiryModal from './components/public/BookingInquiryModal';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Globe2,
  Award,
  ArrowRight,
  Send,
  Users,
  Briefcase,
  Calendar,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('public'); // 'public' | 'crm'
  const [talents, setTalents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [detailModalTalent, setDetailModalTalent] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingTalent, setBookingTalent] = useState(null);

  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, ...toast }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch initial talents & stats
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [talentsData, statsData] = await Promise.all([
          fetchTalents().catch((err) => {
            console.warn('Talents API fetch error:', err);
            return [];
          }),
          fetchStats().catch((err) => {
            console.warn('Stats API fetch error:', err);
            return null;
          })
        ]);

        setTalents(talentsData || []);
        setStats(statsData);
        setError(null);
      } catch (err) {
        console.error('Data initialization error:', err);
        setError(err.message || 'Failed to connect to backend server');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Handler for opening talent detail modal
  const handleOpenDetail = (talent) => {
    setDetailModalTalent(talent);
  };

  // Handler for opening booking modal
  const handleOpenBooking = (talent = null) => {
    setBookingTalent(talent);
    setBookingModalOpen(true);
  };

  // Handler for booking inquiry success
  const handleBookingSuccess = (createdProject, formData) => {
    addToast({
      type: 'success',
      title: 'Booking Inquiry Received!',
      message: `Thank you, ${formData.contact_person}. We have logged your inquiry for "${formData.project_title}" and will contact ${formData.email} within 24 hours.`
    });
  };

  // Smooth scroll to catalog
  const handleExploreRoster = () => {
    const catalogEl = document.getElementById('talents-catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Bar with View Switcher */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenInquiry={() => handleOpenBooking(null)}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {currentView === 'public' ? (
          <>
            {/* 1. Public Marketing Hero Banner */}
            <HeroBanner
              stats={stats}
              onExploreRoster={handleExploreRoster}
              onOpenInquiry={() => handleOpenBooking(null)}
            />

            {/* 2. Interactive Talent Catalog */}
            <TalentCatalog
              talents={talents}
              loading={loading}
              onSelectTalent={handleOpenDetail}
              onBookTalent={handleOpenBooking}
            />

            {/* 3. Agency Capabilities & Highlights Section */}
            <section
              id="agency-highlights"
              style={{
                padding: '64px 0',
                borderTop: '1px solid var(--color-border-subtle)',
                background: 'rgba(15, 23, 42, 0.4)'
              }}
            >
              <div className="container">
                <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
                  <span
                    className="badge badge-tag"
                    style={{ marginBottom: '12px', display: 'inline-flex', padding: '4px 14px' }}
                  >
                    ✨ Why Leading Brands Choose TalentPulse
                  </span>
                  <h2 className="font-heading" style={{ fontSize: '2.25rem', marginBottom: '12px' }}>
                    Full-Service Talent & <span className="text-gradient-vibrant">Production Infrastructure</span>
                  </h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>
                    We eliminate the friction in creator collaborations with transparent contracting, dedicated shoot coordinators, and guaranteed delivery schedules.
                  </p>
                </div>

                <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                  <div className="glass-card" style={{ padding: '28px' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(139, 92, 246, 0.15)',
                        color: 'var(--color-accent-purple-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '18px'
                      }}
                    >
                      <ShieldCheck size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Legal & Global Rights Clearance</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
                      Complete usage licensing across digital, OTT, print, and billboard buyouts. Full contract indemnity and SLA guarantees.
                    </p>
                  </div>

                  <div className="glass-card" style={{ padding: '28px' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(236, 72, 153, 0.15)',
                        color: 'var(--color-accent-pink)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '18px'
                      }}
                    >
                      <Zap size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Rapid Production Turnaround</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
                      Direct talent scheduling, pre-production logistics, studio bookings, and high-speed delivery within 48 to 72 hours.
                    </p>
                  </div>

                  <div className="glass-card" style={{ padding: '28px' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: 'var(--color-accent-emerald)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '18px'
                      }}
                    >
                      <Globe2 size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Multi-Market Reach</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
                      International roster across Paris, New York, Tokyo, Milan, and London. Global currency billing and multilingual support.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Bottom Campaign CTA Banner */}
            <section
              id="booking-cta"
              style={{
                padding: '60px 0',
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.8) 100%)',
                borderTop: '1px solid var(--color-border-subtle)'
              }}
            >
              <div className="container">
                <div
                  className="glass-panel animate-fade-in"
                  style={{
                    padding: '48px 36px',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    boxShadow: 'var(--shadow-glass), var(--shadow-glow-purple)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '32px'
                  }}
                >
                  <div style={{ maxWidth: '640px' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(236, 72, 153, 0.15)',
                        color: 'var(--color-accent-pink)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        marginBottom: '12px'
                      }}
                    >
                      <Sparkles size={14} /> Start Your Campaign
                    </div>
                    <h2 className="font-heading" style={{ fontSize: '2.25rem', marginBottom: '12px', lineHeight: 1.2 }}>
                      Ready to Collaborate with <span className="text-gradient-purple-pink">Top Creative Talents</span>?
                    </h2>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
                      Send us your project brief or requested talents. Our agency team handles availability checks, quotation packages, and production timelines seamlessly.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenBooking(null)}
                      className="btn btn-primary btn-lg"
                    >
                      <Send size={18} /> Submit Campaign Brief
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* CRM Portal Overview / Switcher Placeholder (Full suite in Task 5/6/7) */
          <div className="container" style={{ padding: '48px 24px' }}>
            <div
              className="glass-panel animate-scale-in"
              style={{
                padding: '36px',
                marginBottom: '32px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                boxShadow: 'var(--shadow-glass), var(--shadow-glow-blue)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-accent-blue-light)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
                    <LayoutDashboard size={16} /> Agency Internal Operations
                  </div>
                  <h1 className="font-heading" style={{ fontSize: '2.2rem', marginBottom: '8px' }}>
                    TalentPulse <span className="text-gradient-blue-emerald">Agency CRM Suite</span>
                  </h1>
                  <p style={{ color: 'var(--color-text-secondary)', maxWidth: '640px' }}>
                    Centralized talent roster management, client Kanban project pipeline, and master production calendar.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentView('public')}
                  className="btn btn-outline"
                >
                  &larr; Return to Public Showcase
                </button>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid-responsive" style={{ marginBottom: '32px' }}>
              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Active Talents</span>
                  <Users size={20} color="var(--color-accent-purple-light)" />
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800 }}>{stats?.activeTalents ?? talents.length}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-accent-emerald-light)', marginTop: '6px' }}>
                  Ready for campaign booking
                </div>
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Active Projects</span>
                  <Briefcase size={20} color="var(--color-accent-blue-light)" />
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800 }}>{stats?.activeProjects ?? '6'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-accent-blue-light)', marginTop: '6px' }}>
                  Across Kanban workflow stages
                </div>
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>New Inquiries</span>
                  <Sparkles size={20} color="var(--color-accent-pink)" />
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800 }}>{stats?.pendingLeads ?? '2'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-accent-pink)', marginTop: '6px' }}>
                  Inbound showcase leads
                </div>
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Production Shoots</span>
                  <Calendar size={20} color="var(--color-accent-amber-light)" />
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800 }}>{stats?.weekShoots ?? '3'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-accent-amber-light)', marginTop: '6px' }}>
                  Scheduled this week
                </div>
              </div>
            </div>

            {/* Inbound Booking Quick Action */}
            <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Agency Internal Tools Connected</h3>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: '580px', margin: '0 auto 20px' }}>
                Public showcase booking submissions are automatically synchronized with the backend SQLite database and ready for pipeline management.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => handleOpenBooking(null)}
                  className="btn btn-primary"
                >
                  <Send size={16} /> Test Booking Inquiry Flow
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Talent Detail Modal */}
      <TalentDetailModal
        talent={detailModalTalent}
        isOpen={Boolean(detailModalTalent)}
        onClose={() => setDetailModalTalent(null)}
        onBookTalent={(talent) => handleOpenBooking(talent)}
      />

      {/* Booking Inquiry Modal */}
      <BookingInquiryModal
        isOpen={bookingModalOpen}
        selectedTalent={bookingTalent}
        allTalents={talents}
        onClose={() => {
          setBookingModalOpen(false);
          setBookingTalent(null);
        }}
        onSuccess={handleBookingSuccess}
      />

      {/* Floating Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border-subtle)',
          padding: '32px 0',
          background: 'rgba(15, 23, 42, 0.9)',
          marginTop: 'auto'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(135deg, var(--color-accent-purple) 0%, var(--color-accent-pink) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles size={16} color="#FFFFFF" />
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>
              TALENT<span className="text-gradient-purple-pink">PULSE</span>
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              &bull; Creative Agency CRM & Showcase
            </span>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            &copy; 2026 TalentPulse Agency. All rights reserved. Powered by React 18 & SQLite.
          </div>
        </div>
      </footer>
    </div>
  );
}
