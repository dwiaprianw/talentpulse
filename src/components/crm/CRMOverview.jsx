import React from 'react';
import {
  Users,
  Briefcase,
  Sparkles,
  Camera,
  TrendingUp,
  Plus,
  Calendar,
  ChevronRight,
  Clock,
  CheckCircle2,
  Layers
} from 'lucide-react';

export default function CRMOverview({
  stats = {},
  talents = [],
  projects = [],
  schedules = [],
  onNavigateTab = () => {},
  onOpenAddTalent = () => {},
  onOpenAddSchedule = () => {}
}) {
  // Safe stats values
  const activeTalentsCount = stats.activeTalents ?? talents.filter((t) => t.status === 'available').length;
  const totalTalentsCount = stats.totalTalents ?? talents.length;
  const activeProjectsCount = stats.activeProjects ?? projects.filter((p) => p.status_stage !== 'completed').length;
  const pendingLeadsCount = stats.pendingLeads ?? projects.filter((p) => p.status_stage === 'new_lead').length;
  const weekShootsCount = stats.weekShoots ?? schedules.filter((s) => (s.event_type || '').toLowerCase().includes('shoot')).length;

  // Compute total pipeline value from projects in Rupiah (IDR)
  const totalPipelineVal = projects.reduce((acc, p) => {
    if (!p.budget_range) return acc + 50000000;
    const str = p.budget_range;
    if (str.includes('250.000.000+') || str.includes('300.000.000') || str.includes('25,000+')) return acc + 250000000;
    if (str.includes('180.000.000') || str.includes('250.000.000') || str.includes('280.000.000')) return acc + 200000000;
    if (str.includes('120.000.000') || str.includes('150.000.000') || str.includes('160.000.000')) return acc + 140000000;
    if (str.includes('80.000.000') || str.includes('100.000.000')) return acc + 90000000;
    if (str.includes('50.000.000')) return acc + 75000000;
    if (str.includes('25.000.000')) return acc + 37500000;
    return acc + 50000000;
  }, 0);

  const formattedPipelineVal = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(totalPipelineVal);

  // Breakdown counts for pipeline stages
  const stages = [
    { key: 'new_lead', label: 'New Leads', color: 'var(--color-accent-blue-light)' },
    { key: 'quotation_sent', label: 'Quotation Sent', color: 'var(--color-accent-purple-light)' },
    { key: 'confirmed', label: 'Confirmed', color: 'var(--color-accent-pink)' },
    { key: 'in_execution', label: 'In Execution', color: 'var(--color-accent-amber)' },
    { key: 'completed', label: 'Completed', color: 'var(--color-accent-emerald)' }
  ];

  const stageCounts = stages.map((st) => ({
    ...st,
    count: projects.filter((p) => (p.status_stage || 'new_lead') === st.key).length
  }));

  // Breakdown of talents by Category
  const categories = ['Model', 'Influencer', 'Photographer', 'Videographer', 'Designer'];
  const categoryCounts = categories.map((cat) => ({
    name: cat,
    count: talents.filter((t) => (t.category || '').toLowerCase() === cat.toLowerCase()).length
  }));

  // Recent 4 projects
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 4);

  // Upcoming 4 schedule events
  const upcomingSchedules = [...schedules]
    .sort((a, b) => new Date(a.event_date || 0) - new Date(b.event_date || 0))
    .slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Banner Header */}
      <div
        className="glass-panel"
        style={{
          padding: '28px 32px',
          border: '1px solid var(--color-border-medium)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          background: '#FFFFFF',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--color-accent-purple-light)',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '6px'
            }}
          >
            <Layers size={16} /> Agency Command Center
          </div>
          <h1 className="font-heading" style={{ fontSize: '1.9rem', marginBottom: '6px', color: 'var(--color-text-primary)' }}>
            Executive <span className="text-gradient-vibrant">Operations Dashboard</span>
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', maxWidth: '600px' }}>
            Monitor real-time talent roster availability, active deal conversion pipelines, and studio production milestones.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onOpenAddTalent}
            className="btn btn-secondary btn-sm"
            style={{ gap: '6px' }}
          >
            <Plus size={15} /> Add Talent
          </button>

          <button
            type="button"
            onClick={onOpenAddSchedule}
            className="btn btn-secondary btn-sm"
            style={{ gap: '6px' }}
          >
            <Calendar size={15} /> Add Schedule
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('kanban')}
            className="btn btn-primary btn-sm"
            style={{ gap: '6px' }}
          >
            <TrendingUp size={15} /> Manage Pipeline
          </button>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {/* Card 1: Active Talents */}
        <div
          className="kpi-card kpi-card-glow-purple"
          style={{ cursor: 'pointer', background: '#FFFFFF' }}
          onClick={() => onNavigateTab('roster')}
          title="Click to view Talent Roster"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Active Talents
              </span>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.1, marginTop: '4px', color: 'var(--color-text-primary)' }}>
                {activeTalentsCount}
              </div>
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                background: '#F3E8FF',
                color: 'var(--color-accent-purple-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Users size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
            <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <CheckCircle2 size={14} /> {totalTalentsCount} Total in Database
            </span>
            <span style={{ color: 'var(--color-accent-purple-light)', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
              View Roster <ChevronRight size={14} />
            </span>
          </div>
        </div>

        {/* Card 2: Active Projects & Pipeline Value */}
        <div
          className="kpi-card kpi-card-glow-blue"
          style={{ cursor: 'pointer', background: '#FFFFFF' }}
          onClick={() => onNavigateTab('kanban')}
          title="Click to view Kanban Pipeline"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Active Projects & Pipeline
              </span>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.1, marginTop: '4px', color: 'var(--color-text-primary)' }}>
                {activeProjectsCount}
              </div>
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                background: '#DBEAFE',
                color: 'var(--color-accent-blue-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Briefcase size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
            <span style={{ color: '#2563EB', fontWeight: 700 }}>
              {formattedPipelineVal} Pipeline Value
            </span>
            <span style={{ color: 'var(--color-accent-blue-light)', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
              Kanban <ChevronRight size={14} />
            </span>
          </div>
        </div>

        {/* Card 3: Pending New Inquiries */}
        <div
          className="kpi-card kpi-card-glow-pink"
          style={{ cursor: 'pointer', background: '#FFFFFF' }}
          onClick={() => onNavigateTab('kanban')}
          title="Click to review Pending Inquiries"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Pending New Inquiries
              </span>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.1, marginTop: '4px', color: 'var(--color-text-primary)' }}>
                {pendingLeadsCount}
              </div>
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                background: '#FCE7F3',
                color: 'var(--color-accent-pink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
            <span style={{ color: 'var(--color-accent-pink)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <Clock size={14} /> Action Required
            </span>
            <span style={{ color: 'var(--color-accent-pink)', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
              Review <ChevronRight size={14} />
            </span>
          </div>
        </div>

        {/* Card 4: Upcoming Shoots This Week */}
        <div
          className="kpi-card kpi-card-glow-amber"
          style={{ cursor: 'pointer', background: '#FFFFFF' }}
          onClick={() => onNavigateTab('calendar')}
          title="Click to view Master Calendar"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Production Shoots
              </span>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.1, marginTop: '4px', color: 'var(--color-text-primary)' }}>
                {weekShootsCount}
              </div>
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                background: '#FEF3C7',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Camera size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
            <span style={{ color: '#D97706', fontWeight: 600 }}>
              {schedules.length} Total Calendar Events
            </span>
            <span style={{ color: '#D97706', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
              Calendar <ChevronRight size={14} />
            </span>
          </div>
        </div>
      </div>

      {/* Visual Breakdowns Section (2 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Pipeline Stage Distribution */}
        <div className="glass-card" style={{ padding: '24px', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="var(--color-accent-blue-light)" />
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text-primary)' }}>Kanban Pipeline Flow</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('kanban')}
              className="btn btn-outline btn-sm"
              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
            >
              Full Board &rarr;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stageCounts.map((stage) => {
              const pct = projects.length > 0 ? Math.round((stage.count / projects.length) * 100) : 0;
              return (
                <div key={stage.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>{stage.label}</span>
                    <span style={{ fontWeight: 700, color: stage.color }}>
                      {stage.count} deal{stage.count === 1 ? '' : 's'} ({pct}%)
                    </span>
                  </div>
                  <div
                    style={{
                      height: '8px',
                      background: '#F1F5F9',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: stage.color,
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 0.6s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Roster Category Mix */}
        <div className="glass-card" style={{ padding: '24px', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="var(--color-accent-purple-light)" />
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text-primary)' }}>Talent Roster by Category</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('roster')}
              className="btn btn-outline btn-sm"
              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
            >
              Manage Roster &rarr;
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            {categoryCounts.map((cat) => (
              <div
                key={cat.name}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid var(--color-border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-accent-purple-light)' }}>
                  {cat.count}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '2px', fontWeight: 600 }}>
                  {cat.name}s
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: '#D1FAE5',
              border: '1px solid #A7F3D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.85rem'
            }}
          >
            <span style={{ color: '#065F46', fontWeight: 600 }}>Overall Roster Availability:</span>
            <span style={{ color: '#047857', fontWeight: 800 }}>
              {talents.length > 0 ? Math.round((activeTalentsCount / totalTalentsCount) * 100) : 0}% Active & Ready
            </span>
          </div>
        </div>
      </div>

      {/* Recent Inquiries & Upcoming Calendar Schedule Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Recent Pipeline Inquiries */}
        <div className="glass-card" style={{ padding: '24px', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text-primary)' }}>Recent Client Project Leads</h3>
            <button
              type="button"
              onClick={() => onNavigateTab('kanban')}
              style={{ fontSize: '0.82rem', color: 'var(--color-accent-blue-light)', fontWeight: 600 }}
            >
              View all ({projects.length})
            </button>
          </div>

          {recentProjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              No client projects registered yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentProjects.map((p) => {
                const stageLabel =
                  p.status_stage === 'new_lead'
                    ? 'New Lead'
                    : p.status_stage === 'quotation_sent'
                    ? 'Quotation Sent'
                    : p.status_stage === 'confirmed'
                    ? 'Confirmed'
                    : p.status_stage === 'in_execution'
                    ? 'In Execution'
                    : 'Completed';

                const badgeClass =
                  p.status_stage === 'new_lead'
                    ? 'badge-stage-lead'
                    : p.status_stage === 'quotation_sent'
                    ? 'badge-stage-contacted'
                    : p.status_stage === 'confirmed'
                    ? 'badge-stage-briefing'
                    : p.status_stage === 'in_execution'
                    ? 'badge-stage-production'
                    : 'badge-stage-completed';

                return (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      background: '#F8FAFC',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border-medium)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-text-primary)' }}>{p.brand_name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                        {p.project_title} &bull; {p.budget_range || 'Rp 50.000.000 - Rp 100.000.000'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`badge ${badgeClass}`}>{stageLabel}</span>
                      {p.talent_name && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-accent-purple-light)', marginTop: '4px', fontWeight: 600 }}>
                          {p.talent_name}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Production Schedule */}
        <div className="glass-card" style={{ padding: '24px', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text-primary)' }}>Upcoming Production Schedule</h3>
            <button
              type="button"
              onClick={() => onNavigateTab('calendar')}
              style={{ fontSize: '0.82rem', color: '#D97706', fontWeight: 600 }}
            >
              View Calendar ({schedules.length})
            </button>
          </div>

          {upcomingSchedules.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              No upcoming schedule events found.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {upcomingSchedules.map((s) => {
                const type = (s.event_type || '').toLowerCase();
                const badgeStyle =
                  type.includes('shoot')
                    ? { bg: '#F3E8FF', color: '#6B21A8', border: '#D8B4FE', icon: '🟣 Shoot' }
                    : type.includes('post') || type.includes('publish')
                    ? { bg: '#DBEAFE', color: '#1E40AF', border: '#93C5FD', icon: '🔵 Post' }
                    : type.includes('fitting') || type.includes('meeting')
                    ? { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A', icon: '🟠 Meeting' }
                    : { bg: '#FFE4E6', color: '#9F1239', border: '#FECDD3', icon: '🔴 Payment' };

                return (
                  <div
                    key={s.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      background: '#F8FAFC',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border-medium)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-text-primary)' }}>{s.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={12} /> {s.event_date} {s.talent_name && `• ${s.talent_name}`}
                      </div>
                    </div>
                    <div>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: badgeStyle.bg,
                          color: badgeStyle.color,
                          border: `1px solid ${badgeStyle.border}`
                        }}
                      >
                        {badgeStyle.icon}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
