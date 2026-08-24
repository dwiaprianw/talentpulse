import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  ArrowLeft,
  ArrowRight,
  User,
  Calendar,
  DollarSign,
  Mail,
  Phone,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Send,
  Plus
} from 'lucide-react';
import { updateProjectStage } from '../../services/api';

const PIPELINE_STAGES = [
  {
    id: 'new_lead',
    title: 'New Leads',
    subtitle: 'Inbound inquiries',
    badgeColor: 'var(--color-accent-blue-light)',
    badgeBg: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.3)'
  },
  {
    id: 'quotation_sent',
    title: 'Quotation Sent',
    subtitle: 'Proposal delivered',
    badgeColor: 'var(--color-accent-purple-light)',
    badgeBg: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'rgba(139, 92, 246, 0.3)'
  },
  {
    id: 'confirmed',
    title: 'Confirmed',
    subtitle: 'Contract & deposit',
    badgeColor: 'var(--color-accent-cyan)',
    badgeBg: 'rgba(6, 182, 212, 0.15)',
    borderColor: 'rgba(6, 182, 212, 0.3)'
  },
  {
    id: 'in_execution',
    title: 'In Execution',
    subtitle: 'Production & shooting',
    badgeColor: 'var(--color-accent-amber-light)',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.3)'
  },
  {
    id: 'completed',
    title: 'Completed',
    subtitle: 'Delivered & cleared',
    badgeColor: 'var(--color-accent-emerald-light)',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.3)'
  }
];

export default function KanbanPipeline({
  projects = [],
  talents = [],
  onProjectUpdated = () => {},
  onOpenBooking = () => {},
  addToast = () => {}
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [talentFilter, setTalentFilter] = useState('All');
  const [movingProjectId, setMovingProjectId] = useState(null);

  // Helper to extract numeric budget for sum
  const parseBudget = (budgetStr) => {
    if (!budgetStr) return 0;
    const match = budgetStr.match(/\$?([0-9,]+)/);
    if (!match) return 0;
    const parsed = parseInt(match[1].replace(/,/g, ''), 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Filter projects by search query and talent
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Talent filter
      if (talentFilter !== 'All') {
        if (String(p.talent_id) !== String(talentFilter)) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const brandMatch = (p.brand_name || '').toLowerCase().includes(q);
        const titleMatch = (p.project_title || '').toLowerCase().includes(q);
        const typeMatch = (p.project_type || '').toLowerCase().includes(q);
        const personMatch = (p.contact_person || '').toLowerCase().includes(q);
        const talentMatch = (p.talent_name || '').toLowerCase().includes(q);
        return brandMatch || titleMatch || typeMatch || personMatch || talentMatch;
      }

      return true;
    });
  }, [projects, searchQuery, talentFilter]);

  // Stage shifting logic
  const handleShiftStage = async (project, targetStage) => {
    if (!targetStage || project.status_stage === targetStage) return;

    try {
      setMovingProjectId(project.id);
      const updated = await updateProjectStage(project.id, targetStage);
      onProjectUpdated(updated);

      const stageInfo = PIPELINE_STAGES.find((s) => s.id === targetStage);
      addToast({
        type: 'success',
        title: 'Project Moved',
        message: `"${project.project_title}" shifted to ${stageInfo?.title || targetStage}.`
      });
    } catch (err) {
      console.error('Failed to move project stage:', err);
      addToast({
        type: 'error',
        title: 'Stage Update Failed',
        message: err.message || 'Could not update project stage on server'
      });
    } finally {
      setMovingProjectId(null);
    }
  };

  const getNextStage = (currentStage) => {
    const idx = PIPELINE_STAGES.findIndex((s) => s.id === currentStage);
    if (idx < 0 || idx >= PIPELINE_STAGES.length - 1) return null;
    return PIPELINE_STAGES[idx + 1].id;
  };

  const getPrevStage = (currentStage) => {
    const idx = PIPELINE_STAGES.findIndex((s) => s.id === currentStage);
    if (idx <= 0) return null;
    return PIPELINE_STAGES[idx - 1].id;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header & Search/Filters */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h2 className="font-heading" style={{ fontSize: '1.6rem', marginBottom: '4px' }}>
            5-Stage Client Project Kanban Pipeline
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem' }}>
            Track client booking deals from inbound website inquiries through quotation, confirmation, and shoot execution.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search box */}
          <div style={{ position: 'relative', width: '220px' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50)',
                color: 'var(--color-text-muted)'
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search brand, lead..."
              className="glass-input"
              style={{ paddingLeft: '34px', fontSize: '0.85rem' }}
            />
          </div>

          {/* Talent Filter */}
          <select
            value={talentFilter}
            onChange={(e) => setTalentFilter(e.target.value)}
            className="glass-input"
            style={{ width: '180px', fontSize: '0.85rem', background: 'rgba(15, 23, 42, 0.9)' }}
          >
            <option value="All">All Talents</option>
            {talents.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.category})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => onOpenBooking(null)}
            className="btn btn-primary"
            style={{ gap: '6px' }}
          >
            <Plus size={16} /> New Deal / Lead
          </button>
        </div>
      </div>

      {/* 5 Column Kanban Board */}
      <div className="kanban-board-container">
        {PIPELINE_STAGES.map((stage, stageIdx) => {
          // Projects in this column
          const columnProjects = filteredProjects.filter((p) => p.status_stage === stage.id);

          // Total column estimated value
          const columnTotalValue = columnProjects.reduce((sum, p) => sum + parseBudget(p.budget_range), 0);
          const formattedColumnVal = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
          }).format(columnTotalValue);

          return (
            <div key={stage.id} className="kanban-column">
              {/* Column Header */}
              <div className="kanban-column-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: stage.badgeColor
                      }}
                    />
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{stage.title}</h3>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {stage.subtitle} &bull; {formattedColumnVal}
                  </div>
                </div>

                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    background: stage.badgeBg,
                    color: stage.badgeColor,
                    border: `1px solid ${stage.borderColor}`
                  }}
                >
                  {columnProjects.length}
                </span>
              </div>

              {/* Column Body / Deal Cards */}
              <div className="kanban-column-body">
                {columnProjects.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '32px 12px',
                      color: 'var(--color-text-muted)',
                      fontSize: '0.82rem',
                      border: '1px dashed var(--color-border-subtle)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    No deals in {stage.title.toLowerCase()}
                  </div>
                ) : (
                  columnProjects.map((project) => {
                    const prevStage = getPrevStage(project.status_stage);
                    const nextStage = getNextStage(project.status_stage);
                    const isMoving = movingProjectId === project.id;

                    return (
                      <div key={project.id} className="kanban-card">
                        {/* Brand Name & Project Type */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                            <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--color-text-primary)' }}>
                              {project.brand_name}
                            </div>
                            <span
                              style={{
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                color: 'var(--color-accent-purple-light)',
                                background: 'rgba(139, 92, 246, 0.1)',
                                padding: '2px 6px',
                                borderRadius: 'var(--radius-xs)',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {project.project_type || 'Campaign'}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: '4px', fontWeight: 500 }}>
                            {project.project_title}
                          </div>
                        </div>

                        {/* Assigned Talent info */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 10px',
                            background: 'rgba(15, 23, 42, 0.6)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border-subtle)',
                            fontSize: '0.8rem'
                          }}
                        >
                          {project.talent_avatar ? (
                            <img
                              src={project.talent_avatar}
                              alt={project.talent_name || 'Talent'}
                              style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                background: 'rgba(139, 92, 246, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--color-accent-purple-light)'
                              }}
                            >
                              <User size={12} />
                            </div>
                          )}
                          <span style={{ color: 'var(--color-accent-purple-light)', fontWeight: 600 }}>
                            {project.talent_name || 'Unassigned Talent'}
                          </span>
                        </div>

                        {/* Budget & Target Date Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                          <span style={{ fontWeight: 700, color: 'var(--color-accent-emerald-light)' }}>
                            {project.budget_range || '$5,000 - $10,000'}
                          </span>

                          {project.target_date && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={12} /> {project.target_date}
                            </span>
                          )}
                        </div>

                        {/* Contact Person & Email */}
                        {(project.contact_person || project.email) && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span>{project.contact_person || 'Client'}</span>
                              {project.email && (
                                <a
                                  href={`mailto:${project.email}`}
                                  style={{ color: 'var(--color-accent-blue-light)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                                  title={project.email}
                                >
                                  <Mail size={12} /> Email
                                </a>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Stage Movement Controls */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '6px',
                            marginTop: '4px',
                            paddingTop: '8px',
                            borderTop: '1px solid var(--color-border-subtle)'
                          }}
                        >
                          {/* Move Left Button */}
                          <button
                            type="button"
                            disabled={!prevStage || isMoving}
                            onClick={() => handleShiftStage(project, prevStage)}
                            className="btn-icon"
                            style={{
                              padding: '4px 8px',
                              opacity: prevStage ? 1 : 0.25,
                              cursor: prevStage ? 'pointer' : 'default',
                              fontSize: '0.75rem',
                              gap: '4px'
                            }}
                            title={prevStage ? `Move back to ${prevStage}` : 'At first stage'}
                          >
                            <ArrowLeft size={13} />
                          </button>

                          {/* Quick Stage Dropdown Selector */}
                          <select
                            value={project.status_stage}
                            disabled={isMoving}
                            onChange={(e) => handleShiftStage(project, e.target.value)}
                            style={{
                              background: 'rgba(15, 23, 42, 0.8)',
                              border: '1px solid var(--color-border-subtle)',
                              color: 'var(--color-text-secondary)',
                              fontSize: '0.74rem',
                              borderRadius: 'var(--radius-xs)',
                              padding: '3px 6px',
                              cursor: 'pointer',
                              outline: 'none',
                              maxWidth: '120px'
                            }}
                          >
                            {PIPELINE_STAGES.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.title}
                              </option>
                            ))}
                          </select>

                          {/* Move Right Button */}
                          <button
                            type="button"
                            disabled={!nextStage || isMoving}
                            onClick={() => handleShiftStage(project, nextStage)}
                            className="btn-icon"
                            style={{
                              padding: '4px 8px',
                              opacity: nextStage ? 1 : 0.25,
                              cursor: nextStage ? 'pointer' : 'default',
                              fontSize: '0.75rem',
                              gap: '4px'
                            }}
                            title={nextStage ? `Advance to ${nextStage}` : 'Completed'}
                          >
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
