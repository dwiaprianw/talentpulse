import React, { useState, useEffect, useCallback } from 'react';
import { fetchTalents, fetchStats, fetchProjects, fetchSchedules } from './services/api';
import { useAuth } from './services/AuthContext';
import Navbar from './components/common/Navbar';
import Toast from './components/common/Toast';
import AdminLoginModal from './components/auth/AdminLoginModal';
import HeroBanner from './components/public/HeroBanner';
import TalentCatalog from './components/public/TalentCatalog';
import TalentDetailModal from './components/public/TalentDetailModal';
import BookingInquiryModal from './components/public/BookingInquiryModal';
import CRMOverview from './components/crm/CRMOverview';
import TalentRoster from './components/crm/TalentRoster';
import KanbanPipeline from './components/crm/KanbanPipeline';
import MasterCalendar from './components/crm/MasterCalendar';
import AddTalentModal from './components/crm/AddTalentModal';
import AddScheduleModal from './components/crm/AddScheduleModal';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Globe2,
  Send,
  Users,
  Briefcase,
  Calendar,
  TrendingUp,
  LayoutDashboard,
  Lock,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export default function App() {
  const { isAuthenticated, userRole, currentUser } = useAuth();

  const [currentView, setCurrentView] = useState('public'); // 'public' | 'crm'
  const [crmTab, setCrmTab] = useState('overview'); // 'overview' | 'roster' | 'kanban' | 'calendar'
  
  // Data states
  const [talents, setTalents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [detailModalTalent, setDetailModalTalent] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingTalent, setBookingTalent] = useState(null);
  const [addTalentModalOpen, setAddTalentModalOpen] = useState(false);
  const [addScheduleModalOpen, setAddScheduleModalOpen] = useState(false);

  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, ...toast }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch initial data
  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [talentsData, projectsData, schedulesData, statsData] = await Promise.all([
        fetchTalents().catch((err) => {
          console.warn('Talents API fetch error:', err);
          return [];
        }),
        fetchProjects().catch((err) => {
          console.warn('Projects API fetch error:', err);
          return [];
        }),
        fetchSchedules().catch((err) => {
          console.warn('Schedules API fetch error:', err);
          return [];
        }),
        fetchStats().catch((err) => {
          console.warn('Stats API fetch error:', err);
          return null;
        })
      ]);

      setTalents(talentsData || []);
      setProjects(projectsData || []);
      setSchedules(schedulesData || []);
      setStats(statsData);
      setError(null);
    } catch (err) {
      console.error('Data initialization error:', err);
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

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
    if (createdProject) {
      setProjects((prev) => {
        const exists = prev.some((p) => p.id === createdProject.id);
        if (exists) return prev;
        return [createdProject, ...prev];
      });
    }
    // Refresh projects and stats from backend
    fetchProjects().then(setProjects).catch(() => {});
    fetchStats().then(setStats).catch(() => {});

    addToast({
      type: 'success',
      title: 'Booking Inquiry Received!',
      message: `Thank you, ${formData?.contact_person || 'Client'}. We have logged your inquiry for "${formData?.project_title || 'Campaign'}" and will contact ${formData?.email || 'you'} within 24 hours.`
    });
  };

  // View switch handler with auth check & background sync
  const handleViewChange = (view) => {
    if (view === 'crm' && !isAuthenticated) {
      setLoginModalOpen(true);
      return;
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'crm') {
      fetchProjects().then(setProjects).catch(() => {});
      fetchStats().then(setStats).catch(() => {});
      fetchTalents().then(setTalents).catch(() => {});
      fetchSchedules().then(setSchedules).catch(() => {});
    }
  };

  // CRM Update Handlers
  const handleTalentUpdated = (updatedTalent) => {
    if (Array.isArray(updatedTalent)) {
      setTalents(updatedTalent);
    } else {
      setTalents((prev) => prev.map((t) => (t.id === updatedTalent.id ? updatedTalent : t)));
    }
    fetchStats().then(setStats).catch(() => {});
    fetchProjects().then(setProjects).catch(() => {});
  };

  const handleTalentCreated = (newTalent) => {
    setTalents((prev) => [newTalent, ...prev]);
    fetchStats().then(setStats).catch(() => {});
  };

  const handleProjectUpdated = (updatedProject) => {
    if (Array.isArray(updatedProject)) {
      setProjects(updatedProject);
    } else {
      setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
    }
    fetchStats().then(setStats).catch(() => {});
  };

  const handleScheduleCreated = (newSchedule) => {
    setSchedules((prev) => [...prev, newSchedule]);
    fetchStats().then(setStats).catch(() => {});
  };

  const handleScheduleDeleted = (deletedId) => {
    setSchedules((prev) => prev.filter((s) => s.id !== deletedId));
    fetchStats().then(setStats).catch(() => {});
  };

  // Smooth scroll to catalog on public landing page
  const handleExploreRoster = () => {
    const catalogEl = document.getElementById('talents-catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Bar with View Switcher & RBAC */}
      <Navbar
        currentView={currentView}
        onViewChange={handleViewChange}
        onOpenInquiry={() => handleOpenBooking(null)}
        onOpenLoginModal={() => setLoginModalOpen(true)}
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
                borderTop: '1px solid var(--color-border-medium)',
                background: '#F8FAFC'
              }}
            >
              <div className="container">
                <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
                  <span
                    className="badge badge-tag"
                    style={{ marginBottom: '12px', display: 'inline-flex', padding: '4px 14px', background: '#F3E8FF', color: '#6D28D9', border: '1px solid #D8B4FE' }}
                  >
                    ✨ Why Leading Brands Choose TalentPulse
                  </span>
                  <h2 className="font-heading" style={{ fontSize: '2.25rem', marginBottom: '12px', color: 'var(--color-text-primary)' }}>
                    Full-Service Talent & <span className="text-gradient-vibrant">Production Infrastructure</span>
                  </h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>
                    We eliminate the friction in creator collaborations with transparent contracting, dedicated shoot coordinators, and guaranteed delivery schedules.
                  </p>
                </div>

                <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                  <div className="glass-card" style={{ padding: '28px', background: '#FFFFFF', border: '1px solid var(--color-border-medium)', boxShadow: 'var(--shadow-md)' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: 'var(--radius-md)',
                        background: '#F3E8FF',
                        color: 'var(--color-accent-purple-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '18px'
                      }}
                    >
                      <ShieldCheck size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--color-text-primary)' }}>Legal & Global Rights Clearance</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
                      Complete usage licensing across digital, OTT, print, and billboard buyouts. Full contract indemnity and SLA guarantees.
                    </p>
                  </div>

                  <div className="glass-card" style={{ padding: '28px', background: '#FFFFFF', border: '1px solid var(--color-border-medium)', boxShadow: 'var(--shadow-md)' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: 'var(--radius-md)',
                        background: '#FCE7F3',
                        color: 'var(--color-accent-pink)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '18px'
                      }}
                    >
                      <Zap size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--color-text-primary)' }}>Rapid Production Turnaround</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
                      Direct talent scheduling, pre-production logistics, studio bookings, and high-speed delivery within 48 to 72 hours.
                    </p>
                  </div>

                  <div className="glass-card" style={{ padding: '28px', background: '#FFFFFF', border: '1px solid var(--color-border-medium)', boxShadow: 'var(--shadow-md)' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: 'var(--radius-md)',
                        background: '#D1FAE5',
                        color: '#059669',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '18px'
                      }}
                    >
                      <Globe2 size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--color-text-primary)' }}>Multi-Market Reach</h3>
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
                background: 'linear-gradient(180deg, #F8FAFC 0%, #EEF2FF 100%)',
                borderTop: '1px solid var(--color-border-medium)'
              }}
            >
              <div className="container">
                <div
                  className="glass-panel animate-fade-in"
                  style={{
                    padding: '48px 36px',
                    background: '#FFFFFF',
                    border: '1px solid var(--color-border-medium)',
                    boxShadow: 'var(--shadow-xl)',
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
                        background: '#FCE7F3',
                        color: 'var(--color-accent-pink)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        marginBottom: '12px'
                      }}
                    >
                      <Sparkles size={14} /> Start Your Campaign
                    </div>
                    <h2 className="font-heading" style={{ fontSize: '2.25rem', marginBottom: '12px', lineHeight: 1.2, color: 'var(--color-text-primary)' }}>
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
        ) : !isAuthenticated ? (
          /* ==========================================================================
             RBAC ACCESS DENIED GUARD OVERLAY
             ========================================================================== */
          <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
            <div
              className="glass-card animate-scale-in"
              style={{
                maxWidth: '520px',
                margin: '0 auto',
                padding: '48px 32px',
                background: '#FFFFFF',
                border: '1px solid var(--color-border-medium)',
                boxShadow: 'var(--shadow-xl)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius-full)',
                  background: '#FFE4E6',
                  color: '#BE123C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(190, 18, 60, 0.2)'
                }}
              >
                <ShieldAlert size={32} />
              </div>
              <h2 className="font-heading" style={{ fontSize: '1.6rem', color: 'var(--color-text-primary)' }}>
                Akses Terproteksi (RBAC)
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.94rem', lineHeight: 1.5 }}>
                Halaman <strong>Agency CRM Portal</strong> hanya dapat diakses oleh akun terautentikasi (Super Admin atau Account Manager).
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => setCurrentView('public')}
                  className="btn btn-secondary"
                >
                  Kembali ke Public Showcase
                </button>

                <button
                  type="button"
                  onClick={() => setLoginModalOpen(true)}
                  className="btn btn-primary"
                >
                  <Lock size={16} /> Login ke Admin CRM
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ==========================================================================
             AGENCY CRM PORTAL SUITE (AUTHENTICATED)
             ========================================================================== */
          <div className="container" style={{ padding: '36px 24px 64px' }}>
            {/* CRM Navigation Sub-Header & Tab Selector */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '28px'
              }}
            >
              {/* Tab Navigation */}
              <div className="crm-nav-tabs">
                <button
                  type="button"
                  onClick={() => setCrmTab('overview')}
                  className={`crm-tab-btn ${crmTab === 'overview' ? 'active' : ''}`}
                >
                  <LayoutDashboard size={16} /> Overview
                </button>

                <button
                  type="button"
                  onClick={() => setCrmTab('roster')}
                  className={`crm-tab-btn ${crmTab === 'roster' ? 'active' : ''}`}
                >
                  <Users size={16} /> Talent Roster ({talents.length})
                </button>

                <button
                  type="button"
                  onClick={() => setCrmTab('kanban')}
                  className={`crm-tab-btn ${crmTab === 'kanban' ? 'active' : ''}`}
                >
                  <TrendingUp size={16} /> Kanban Pipeline ({projects.length})
                </button>

                <button
                  type="button"
                  onClick={() => setCrmTab('calendar')}
                  className={`crm-tab-btn ${crmTab === 'calendar' ? 'active' : ''}`}
                >
                  <Calendar size={16} /> Master Calendar ({schedules.length})
                </button>
              </div>

              {/* View Switch / Quick Action */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleViewChange('public')}
                  className="btn btn-secondary btn-sm"
                >
                  &larr; View Public Showcase
                </button>
              </div>
            </div>

            {/* Render Active CRM Tab View */}
            {crmTab === 'overview' && (
              <CRMOverview
                stats={stats}
                talents={talents}
                projects={projects}
                schedules={schedules}
                onNavigateTab={(tab) => setCrmTab(tab)}
                onOpenAddTalent={() => setAddTalentModalOpen(true)}
                onOpenAddSchedule={() => setAddScheduleModalOpen(true)}
              />
            )}

            {crmTab === 'roster' && (
              <TalentRoster
                talents={talents}
                onTalentUpdated={handleTalentUpdated}
                onUpdateTalents={handleTalentUpdated}
                onTalentCreated={handleTalentCreated}
                onViewTalentDetails={handleOpenDetail}
                addToast={addToast}
              />
            )}

            {crmTab === 'kanban' && (
              <KanbanPipeline
                projects={projects}
                talents={talents}
                onProjectUpdated={handleProjectUpdated}
                onUpdateProjects={handleProjectUpdated}
                onOpenBooking={() => handleOpenBooking(null)}
                addToast={addToast}
                onTriggerToast={addToast}
              />
            )}

            {crmTab === 'calendar' && (
              <MasterCalendar
                schedules={schedules}
                talents={talents}
                projects={projects}
                onScheduleCreated={handleScheduleCreated}
                onScheduleDeleted={handleScheduleDeleted}
                addToast={addToast}
              />
            )}
          </div>
        )}
      </main>

      {/* Admin Login Modal (RBAC) */}
      <AdminLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={() => {
          setCurrentView('crm');
          addToast({
            type: 'success',
            title: 'Berhasil Login!',
            message: `Selamat datang kembali di Admin CRM.`
          });
        }}
      />

      {/* Talent Detail Modal (Public + CRM) */}
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

      {/* Add Talent Modal (CRM Global) */}
      <AddTalentModal
        isOpen={addTalentModalOpen}
        onClose={() => setAddTalentModalOpen(false)}
        onSuccess={handleTalentCreated}
      />

      {/* Add Schedule Modal (CRM Global) */}
      <AddScheduleModal
        isOpen={addScheduleModalOpen}
        talents={talents}
        projects={projects}
        onClose={() => setAddScheduleModalOpen(false)}
        onSuccess={handleScheduleCreated}
      />

      {/* Floating Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border-medium)',
          padding: '32px 0',
          background: '#FFFFFF',
          color: 'var(--color-text-primary)',
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
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              TALENT<span className="text-gradient-purple-pink">PULSE</span>
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
              &bull; Creative Talent & Production Showcase
            </span>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>&copy; 2026 TalentPulse Agency. All rights reserved.</span>
            {!isAuthenticated && (
              <button
                type="button"
                onClick={() => setLoginModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Akses Internal Staff Agency"
              >
                &bull; Staff Login 🔒
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
