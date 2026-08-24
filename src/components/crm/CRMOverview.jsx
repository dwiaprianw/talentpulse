import React from 'react';
import {
  Users,
  Briefcase,
  Sparkles,
  Calendar,
  TrendingUp,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Camera,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function CRMOverview({
  stats = null,
  talents = [],
  projects = [],
  schedules = [],
  onNavigateTab = () => {},
  onOpenAddTalent = () => {},
  onOpenAddSchedule = () => {}
}) {
  // Compute fallback / live values
  const activeTalents = talents.filter((t) => t.status !== 'unavailable');
  const totalTalentsCount = talents.length;
  const activeTalentsCount = stats?.activeTalents ?? activeTalents.length;

  const activeProjects = projects.filter((p) => p.status_stage !== 'completed');
  const activeProjectsCount = stats?.activeProjects ?? activeProjects.length;

  const pendingLeads = projects.filter((p) => p.status_stage === 'new_lead');
  const pendingLeadsCount = stats?.pendingLeads ?? pendingLeads.length;

  // Approximate pipeline value
  const totalPipelineVal = projects
    .filter((p) => p.status_stage !== 'completed')
    .reduce((acc, p) => {
      const match = (p.budget_range || '').match(/\$([0-9,]+)/);
      if (match) {
        const num = parseInt(match[1].replace(/,/g, ''), 10);
        return acc + (isNaN(num) ? 0 : num);
      }
      return acc + 10000; // default estimated average if unparsed
    }, 0);

  const formattedPipelineVal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(totalPipelineVal);

  // Shoots scheduled
  const shootsList = schedules.filter(
    (s) => (s.event_type || '').toLowerCase().includes('shoot') || (s.event_type || '').toLowerCase() === 'shooting'
  );
  const weekShootsCount = stats?.weekShoots ?? shootsList.length;

  // Category counts
  const categories = ['Model', 'Influencer', 'Photographer', 'Videographer', 'Designer'];
  const categoryCounts = categories.map((cat) => ({
    name: cat,
    count: talents.filter((t) => (t.category || '').toLowerCase() === cat.toLowerCase()).length
  }));

  // Pipeline stage breakdown
  const stages = [
    { key: 'new_lead', label: 'New Leads', color: 'var(--color-accent-blue-light)' },
    { key: 'quotation_sent', label: 'Quotation Sent', color: 'var(--color-accent-purple-light)' },
    { key: 'confirmed', label: 'Confirmed', color: 'var(--color-accent-cyan)' },
    { key: 'in_execution', label: 'In Execution', color: 'var(--color-accent-amber-light)' },
    { key: 'completed', label: 'Completed', color: 'var(--color-accent-emerald-light)' }
  ];

  const stageCounts = stages.map((stage) => ({
    ...stage,
    count: projects.filter((p) => p.status_stage === stage.key).length
  }));

  // Recent 4 inquiries / projects
  const recentProjects = [...projects].slice(0, 4);

  // Upcoming 4 schedules
  const upcomingSchedules = [...schedules]
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
    .slice(0, 4);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Banner with Quick Actions */}
      <div
        className="glass-panel"
        style={{
          padding: '28px 32px',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)'
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--color-accent-blue-light)',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '6px'
            }}
          >
            <Layers size={16} /> Agency Command Center
          </div>
          <h1 className="font-heading" style={{ fontSize: '1.9rem', marginBottom: '6px' }}>
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
          style={{ cursor: 'pointer' }}
          onClick={() => onNavigateTab('roster')}
          title="Click to view Talent Roster"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Active Talents
              </span>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.1, marginTop: '4px' }}>
                {activeTalentsCount}
              </div>
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(139, 92, 246, 0.15)',
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
            <span style={{ color: 'var(--color-accent-emerald-light)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
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
          style={{ cursor: 'pointer' }}
          onClick={() => onNavigateTab('kanban')}
          title="Click to view Kanban Pipeline"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Active Projects & Pipeline
              </span>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.1, marginTop: '4px' }}>
                {activeProjectsCount}
              </div>
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(59, 130, 246, 0.15)',
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
            <span style={{ color: 'var(--color-accent-cyan)', fontWeight: 700 }}>
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
          style={{ cursor: 'pointer' }}
          onClick={() => onNavigateTab('kanban')}
          title="Click to review Pending Inquiries"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Pending New Inquiries
              </span>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.1, marginTop: '4px' }}>
                {pendingLeadsCount}
              </div>
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(236, 72, 153, 0.15)',
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
          style={{ cursor: 'pointer' }}
          onClick={() => onNavigateTab('calendar')}
          title="Click to view Master Calendar"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Production Shoots
              </span>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.1, marginTop: '4px' }}>
                {weekShootsCount}
              </div>
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.15)',
                color: 'var(--color-accent-amber-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Camera size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
            <span style={{ color: 'var(--color-accent-amber-light)', fontWeight: 600 }}>
              {schedules.length} Total Calendar Events
            </span>
            <span style={{ color: 'var(--color-accent-amber-light)', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
              Calendar <ChevronRight size={14} />
            </span>
          </div>
        </div>
      </div>

      {/* Visual Breakdowns Section (2 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Pipeline Stage Distribution */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="var(--color-accent-blue-light)" />
              <h3 style={{ fontSize: '1.15rem' }}>Kanban Pipeline Flow</h3>
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
                      background: 'rgba(255, 255, 255, 0.06)',
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
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="var(--color-accent-purple-light)" />
              <h3 style={{ fontSize: '1.15rem' }}>Talent Roster by Category</h3>
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
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-accent-purple-light)' }}>
                  {cat.count}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  {cat.name}s
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.85rem'
            }}
          >
            <span style={{ color: 'var(--color-text-secondary)' }}>Overall Roster Availability:</span>
            <span style={{ color: 'var(--color-accent-emerald-light)', fontWeight: 700 }}>
              {talents.length > 0 ? Math.round((activeTalentsCount / totalTalentsCount) * 100) : 0}% Active & Ready
            </span>
          </div>
        </div>
      </div>

      {/* Recent Inquiries & Upcoming Calendar Schedule Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Recent Pipeline Inquiries */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Recent Client Project Leads</h3>
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
                      background: 'rgba(15, 23, 42, 0.45)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border-subtle)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{p.brand_name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                        {p.project_title} &bull; {p.budget_range || '$5K-$10K'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`badge ${badgeClass}`}>{stageLabel}</span>
                      {p.talent_name && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-accent-purple-light)', marginTop: '4px' }}>
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
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Upcoming Production Schedule</h3>
            <button
              type="button"
              onClick={() => onNavigateTab('calendar')}
              style={{ fontSize: '0.82rem', color: 'var(--color-accent-amber-light)', fontWeight: 600 }}
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
                    ? { bg: 'rgba(139, 92, 246, 0.15)', color: '#DDD6FE', border: 'rgba(139, 92, 246, 0.4)', icon: '🟣 Shoot' }
                    : type.includes('post') || type.includes('publish')
                    ? { bg: 'rgba(59, 130, 246, 0.15)', color: '#BFDBFE', border: 'rgba(59, 130, 246, 0.4)', icon: '🔵 Post' }
                    : type.includes('fitting') || type.includes('meeting')
                    ? { bg: 'rgba(245, 158, 11, 0.15)', color: '#FDE68A', border: 'rgba(245, 158, 11, 0.4)', icon: '🟠 Meeting' }
                    : { bg: 'rgba(244, 63, 94, 0.15)', color: '#FECDD3', border: 'rgba(244, 63, 94, 0.4)', icon: '🔴 Payment' };

                return (
                  <div
                    key={s.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      background: 'rgba(15, 23, 42, 0.45)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border-subtle)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{s.title}</div>
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
