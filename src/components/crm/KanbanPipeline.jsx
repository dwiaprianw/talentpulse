import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  Plus,
  ArrowRight,
  ArrowLeft,
  User,
  Calendar,
  Mail
} from 'lucide-react';
import { updateProjectStage } from '../../services/api';

const PIPELINE_STAGES = [
  {
    id: 'new_lead',
    title: 'New Leads',
    subtitle: 'Public Inquiries',
    badgeBg: '#DBEAFE',
    badgeColor: '#1D4ED8',
    borderColor: '#BFDBFE'
  },
  {
    id: 'quotation_sent',
    title: 'Quotation Sent',
    subtitle: 'Proposal Pending',
    badgeBg: '#F3E8FF',
    badgeColor: '#6B21A8',
    borderColor: '#E9D5FF'
  },
  {
    id: 'confirmed',
    title: 'Confirmed',
    subtitle: 'Deposit Paid',
    badgeBg: '#FCE7F3',
    badgeColor: '#BE185D',
    borderColor: '#FBCFE8'
  },
  {
    id: 'in_execution',
    title: 'In Execution',
    subtitle: 'Shooting & Editing',
    badgeBg: '#FEF3C7',
    badgeColor: '#B45309',
    borderColor: '#FDE68A'
  },
  {
    id: 'completed',
    title: 'Completed',
    subtitle: 'Delivered & Invoiced',
    badgeBg: '#D1FAE5',
    badgeColor: '#047857',
    borderColor: '#A7F3D0'
  }
];

export default function KanbanPipeline({
  projects = [],
  talents = [],
  onProjectUpdated,
  onUpdateProjects,
  onOpenBooking = () => {},
  addToast,
  onTriggerToast
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [talentFilter, setTalentFilter] = useState('All');
  const [movingProjectId, setMovingProjectId] = useState(null);

  const triggerToast = addToast || onTriggerToast || (() => {});
  const notifyProjectUpdate = onProjectUpdated || onUpdateProjects || (() => {});

  // Helper to calculate numerical value of budget range string in Rupiah (IDR)
  const parseBudget = (budgetStr) => {
    if (!budgetStr) return 50000000;
    const str = budgetStr.toString();
    if (str.includes('250.000.000+') || str.includes('300.000.000') || str.includes('25,000+')) return 250000000;
    if (str.includes('180.000.000') || str.includes('250.000.000') || str.includes('280.000.000')) return 200000000;
    if (str.includes('120.000.000') || str.includes('150.000.000') || str.includes('160.000.000')) return 140000000;
    if (str.includes('80.000.000') || str.includes('100.000.000')) return 90000000;
    if (str.includes('50.000.000')) return 75000000;
    if (str.includes('25.000.000')) return 37500000;
    return 50000000;
  };

  // Filter projects by search and assigned talent
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      (p.brand_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.project_title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.contact_person || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTalent = talentFilter === 'All' || String(p.talent_id) === String(talentFilter);

    return matchesSearch && matchesTalent;
  });

  // Calculate Total Active Pipeline Value in Rupiah (IDR)
  const totalPipelineVal = filteredProjects.reduce((sum, p) => sum + parseBudget(p.budget_range), 0);
  const formattedPipelineVal = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(totalPipelineVal);

  // Advance or revert project stage
  const handleShiftStage = async (project, newStageId) => {
    if (!newStageId || project.status_stage === newStageId) return;

    try {
      setMovingProjectId(project.id);
      const updated = await updateProjectStage(project.id, newStageId);

      const updatedProjectObj = { ...project, status_stage: newStageId, ...updated };
      const updatedProjectsList = projects.map((p) =>
        p.id === project.id ? updatedProjectObj : p
      );

      // Trigger state updates in parent App
      notifyProjectUpdate(updatedProjectsList);

      const targetStageObj = PIPELINE_STAGES.find((s) => s.id === newStageId);
      triggerToast({
        type: 'success',
        title: 'Kanban Stage Updated',
        message: `Project "${project.brand_name}" moved to ${targetStageObj?.title || newStageId}`
      });
    } catch (err) {
      console.error('Failed to update stage:', err);
      triggerToast({
        type: 'error',
        title: 'Stage Update Failed',
        message: err.message || 'Could not update deal stage.'
      });
    } finally {
      setMovingProjectId(null);
    }
  };

  const getNextStage = (currentStageId) => {
    const idx = PIPELINE_STAGES.findIndex((s) => s.id === currentStageId);
    if (idx >= 0 && idx < PIPELINE_STAGES.length - 1) {
      return PIPELINE_STAGES[idx + 1].id;
    }
    return null;
  };

  const getPrevStage = (currentStageId) => {
    const idx = PIPELINE_STAGES.findIndex((s) => s.id === currentStageId);
    if (idx > 0) {
      return PIPELINE_STAGES[idx - 1].id;
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Controls Toolbar */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          background: '#FFFFFF',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--color-border-medium)'
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-accent-blue-light)',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '4px'
            }}
          >
            <TrendingUp size={15} /> Deal Flow Management
          </div>
          <h2 className="font-heading" style={{ fontSize: '1.6rem', color: 'var(--color-text-primary)' }}>
            Project <span className="text-gradient-vibrant">Kanban Pipeline</span>
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.86rem' }}>
            Track client inquiries from lead submission to contract execution. Pipeline Value: {' '}
            <strong style={{ color: 'var(--color-accent-emerald-light)' }}>{formattedPipelineVal}</strong>
          </p>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Keyword Search */}
          <div style={{ position: 'relative', width: '220px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)'
              }}
            />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input"
              style={{ paddingLeft: '36px', fontSize: '0.85rem', height: '38px' }}
            />
          </div>

          {/* Talent Filter */}
          <select
            value={talentFilter}
            onChange={(e) => setTalentFilter(e.target.value)}
            className="glass-input"
            style={{ width: '180px', fontSize: '0.85rem', background: '#FFFFFF', color: '#0F172A', height: '38px' }}
          >
            <option value="All" style={{ background: '#FFFFFF', color: '#0F172A' }}>All Talents</option>
            {talents.map((t) => (
              <option key={t.id} value={t.id} style={{ background: '#FFFFFF', color: '#0F172A' }}>
                {t.name} ({t.category})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => onOpenBooking(null)}
            className="btn btn-primary"
            style={{ gap: '6px', height: '38px' }}
          >
            <Plus size={16} /> New Deal / Lead
          </button>
        </div>
      </div>

      {/* 5 Column Kanban Board */}
      <div className="kanban-board-container">
        {PIPELINE_STAGES.map((stage) => {
          const columnProjects = filteredProjects.filter((p) => p.status_stage === stage.id);
          const columnTotalValue = columnProjects.reduce((sum, p) => sum + parseBudget(p.budget_range), 0);
          const formattedColumnVal = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
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
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{stage.title}</h3>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: '2px', fontWeight: 600 }}>
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
                      border: '1px dashed var(--color-border-medium)',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 500
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
                      <div key={project.id} className="kanban-card" style={{ overflow: 'hidden' }}>
                        {/* Brand Name & Project Type */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                            <div
                              style={{
                                fontWeight: 800,
                                fontSize: '0.98rem',
                                color: 'var(--color-text-primary)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                wordBreak: 'break-word'
                              }}
                            >
                              {project.brand_name}
                            </div>
                            <span
                              style={{
                                fontSize: '0.66rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                color: '#6D28D9',
                                background: '#F3E8FF',
                                border: '1px solid #D8B4FE',
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-full)',
                                maxWidth: '130px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flexShrink: 0
                              }}
                              title={project.project_type || 'Campaign'}
                            >
                              {project.project_type || 'Campaign'}
                            </span>
                          </div>

                          <div
                            style={{
                              fontSize: '0.82rem',
                              color: 'var(--color-text-secondary)',
                              marginTop: '4px',
                              fontWeight: 600,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
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
                            background: '#F8FAFC',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border-medium)',
                            fontSize: '0.8rem',
                            overflow: 'hidden'
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
                                objectFit: 'cover',
                                flexShrink: 0
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                background: '#F3E8FF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#6D28D9',
                                flexShrink: 0
                              }}
                            >
                              <User size={12} />
                            </div>
                          )}
                          <span
                            style={{
                              color: '#6D28D9',
                              fontWeight: 700,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {project.talent_name || 'Unassigned Talent'}
                          </span>
                        </div>

                        {/* Budget & Target Date Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--color-text-secondary)', flexWrap: 'wrap', gap: '4px' }}>
                          <span style={{ fontWeight: 800, color: '#059669' }}>
                            {project.budget_range || 'Rp 50.000.000 - Rp 100.000.000'}
                          </span>

                          {project.target_date && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                              <Calendar size={12} /> {project.target_date}
                            </span>
                          )}
                        </div>

                        {/* Contact Person & Email */}
                        {(project.contact_person || project.email) && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border-medium)', paddingTop: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                              <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.contact_person || 'Client'}</span>
                              {project.email && (
                                <a
                                  href={`mailto:${project.email}`}
                                  style={{ color: '#2563EB', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}
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
                            borderTop: '1px solid var(--color-border-medium)'
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
                              background: '#F8FAFC',
                              border: '1px solid var(--color-border-medium)',
                              color: '#0F172A',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              borderRadius: 'var(--radius-xs)',
                              padding: '4px 8px',
                              cursor: 'pointer',
                              outline: 'none',
                              maxWidth: '130px',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {PIPELINE_STAGES.map((s) => (
                              <option key={s.id} value={s.id} style={{ background: '#FFFFFF', color: '#0F172A' }}>
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
