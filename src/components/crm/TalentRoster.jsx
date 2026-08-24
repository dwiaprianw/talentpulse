import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Grid,
  List,
  Eye,
  Percent,
  Lock
} from 'lucide-react';
import { updateTalentStatus } from '../../services/api';
import AddTalentModal from './AddTalentModal';
import { useAuth } from '../../services/AuthContext';

const CATEGORIES = ['All', 'Model', 'Influencer', 'Photographer', 'Videographer', 'Designer'];

const STATUS_CONFIG = {
  available: { label: 'Available', bg: '#D1FAE5', color: '#047857', border: '#A7F3D0' },
  on_shoot: { label: 'On Shooting', bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' },
  unavailable: { label: 'Off Duty', bg: '#FFE4E6', color: '#BE123C', border: '#FECDD3' }
};

export default function TalentRoster({
  talents = [],
  onUpdateTalents = () => {},
  onTalentUpdated = () => {},
  onTalentCreated = () => {},
  onViewTalentDetails = () => {},
  addToast = () => {}
}) {
  const { userRole } = useAuth();
  const isAdmin = userRole === 'admin';

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  const notifyTalentUpdate = onTalentUpdated || onUpdateTalents || (() => {});
  const notifyTalentCreated = onTalentCreated || (() => {});

  // Calculate gross margin percentage
  const calculateMargin = (internalFeeStr, rateCardStr) => {
    try {
      const parseNum = (str) => {
        if (!str) return 0;
        const cleaned = str.replace(/[^0-9]/g, '');
        return parseFloat(cleaned) || 0;
      };

      const cost = parseNum(internalFeeStr);
      const gross = parseNum(rateCardStr);

      if (cost === 0 || gross === 0 || gross <= cost) return 40;
      return Math.round(((gross - cost) / gross) * 100);
    } catch {
      return 35;
    }
  };

  // Filter talents
  const filteredTalents = talents.filter((talent) => {
    const matchesCategory =
      activeCategory === 'All' ||
      (talent.category || '').toLowerCase() === activeCategory.toLowerCase();

    const matchesSearch =
      (talent.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (talent.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof talent.niche_tags === 'string' && talent.niche_tags.toLowerCase().includes(searchQuery.toLowerCase()));

    const statusKey = (talent.status || 'available').toLowerCase();
    const matchesStatus = statusFilter === 'All' || statusKey === statusFilter.toLowerCase();

    return matchesCategory && matchesSearch && matchesStatus;
  });

  // Cycle status between available -> on_shoot -> unavailable
  const handleToggleStatus = async (talent) => {
    const statusCycle = ['available', 'on_shoot', 'unavailable'];
    const currentIdx = statusCycle.indexOf((talent.status || 'available').toLowerCase());
    const nextStatus = statusCycle[(currentIdx + 1) % statusCycle.length];

    try {
      setStatusUpdatingId(talent.id);
      const updated = await updateTalentStatus(talent.id, nextStatus);

      // Update parent state
      const updatedTalentObj = { ...talent, status: nextStatus, ...updated };
      const updatedList = talents.map((t) =>
        t.id === talent.id ? updatedTalentObj : t
      );
      notifyTalentUpdate(updatedList);

      addToast({
        type: 'success',
        title: 'Status Updated',
        message: `${talent.name}'s status changed to ${STATUS_CONFIG[nextStatus]?.label}`
      });
    } catch (err) {
      console.error('Error updating status:', err);
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Could not update talent status'
      });
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleCreated = (newTalent) => {
    notifyTalentCreated(newTalent);
    addToast({
      type: 'success',
      title: 'Talent Registered',
      message: `${newTalent.name} added to agency roster!`
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Control Header & Filters Toolbar */}
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
              color: 'var(--color-accent-purple-light)',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '4px'
            }}
          >
            <Users size={15} /> Roster & Fee Management
          </div>
          <h2 className="font-heading" style={{ fontSize: '1.6rem', color: 'var(--color-text-primary)' }}>
            Agency <span className="text-gradient-purple-pink">Talent Roster</span>
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.86rem' }}>
            Manage talent availability, fee splits, gross margin tracking, and profile metadata.
          </p>
        </div>

        {/* Action Buttons & View Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Table / Grid Switcher */}
          <div
            style={{
              background: '#F1F5F9',
              padding: '3px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              border: '1px solid var(--color-border-medium)'
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className="btn-icon"
              style={{
                padding: '6px 10px',
                background: viewMode === 'table' ? 'linear-gradient(135deg, var(--color-accent-purple) 0%, var(--color-accent-pink) 100%)' : 'transparent',
                color: viewMode === 'table' ? '#FFFFFF' : 'var(--color-text-secondary)',
                borderRadius: 'var(--radius-sm)'
              }}
              title="Table View"
            >
              <List size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className="btn-icon"
              style={{
                padding: '6px 10px',
                background: viewMode === 'grid' ? 'linear-gradient(135deg, var(--color-accent-purple) 0%, var(--color-accent-pink) 100%)' : 'transparent',
                color: viewMode === 'grid' ? '#FFFFFF' : 'var(--color-text-secondary)',
                borderRadius: 'var(--radius-sm)'
              }}
              title="Grid Cards View"
            >
              <Grid size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="btn btn-primary"
            style={{ gap: '6px' }}
          >
            <Plus size={16} /> Register Talent
          </button>
        </div>
      </div>

      {/* Category Pills & Search Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  transition: 'all var(--transition-fast)',
                  background: isActive ? 'linear-gradient(135deg, var(--color-accent-purple) 0%, var(--color-accent-pink) 100%)' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                  border: isActive ? '1px solid transparent' : '1px solid var(--color-border-medium)',
                  boxShadow: isActive ? '0 2px 8px rgba(139, 92, 246, 0.3)' : 'var(--shadow-sm)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search & Status Filters */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '220px' }}>
            <Search
              size={15}
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search talent or tags..."
              className="glass-input"
              style={{ paddingLeft: '34px', fontSize: '0.85rem' }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass-input"
            style={{ width: '150px', fontSize: '0.85rem', background: '#FFFFFF', color: '#0F172A' }}
          >
            <option value="All" style={{ background: '#FFFFFF', color: '#0F172A' }}>All Statuses</option>
            <option value="available" style={{ background: '#FFFFFF', color: '#0F172A' }}>🟢 Available</option>
            <option value="on_shoot" style={{ background: '#FFFFFF', color: '#0F172A' }}>🟡 On Shooting</option>
            <option value="unavailable" style={{ background: '#FFFFFF', color: '#0F172A' }}>🔴 Off Duty</option>
          </select>
        </div>
      </div>

      {/* Roster Results Count Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <span>Showing <strong>{filteredTalents.length}</strong> of <strong>{talents.length}</strong> talents</span>
        <span>Tip: Click any status pill to cycle its availability state</span>
      </div>

      {/* VIEW MODE 1: Table View */}
      {viewMode === 'table' ? (
        <div className="roster-table-wrapper">
          <table className="roster-table">
            <thead>
              <tr>
                <th>Talent</th>
                <th>Category & Tags</th>
                <th>Audience / Metrics</th>
                <th>Agency Cost (Internal)</th>
                <th>Public Rate Card</th>
                <th>Gross Margin</th>
                <th>Live Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTalents.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                    No talents found matching your search or category filter.
                  </td>
                </tr>
              ) : (
                filteredTalents.map((talent) => {
                  const statusKey = (talent.status || 'available').toLowerCase();
                  const currentStatusConfig = STATUS_CONFIG[statusKey] || STATUS_CONFIG.available;
                  const margin = calculateMargin(talent.internal_fee, talent.rate_card);
                  const isUpdating = statusUpdatingId === talent.id;

                  const tags = Array.isArray(talent.niche_tags)
                    ? talent.niche_tags
                    : typeof talent.niche_tags === 'string'
                    ? talent.niche_tags.split(',').map((s) => s.trim())
                    : [];

                  return (
                    <tr key={talent.id}>
                      {/* Talent Info */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={talent.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
                            alt={talent.name}
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: 'var(--radius-md)',
                              objectFit: 'cover',
                              border: '1px solid var(--color-border-medium)'
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>{talent.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                              {talent.title}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category & Tags */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              width: 'fit-content',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              color: 'var(--color-accent-purple-light)'
                            }}
                          >
                            {talent.category}
                          </span>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {tags.slice(0, 2).map((t, idx) => (
                              <span key={idx} className="badge badge-tag" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                                {t}
                              </span>
                            ))}
                            {tags.length > 2 && (
                              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                                +{tags.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Metrics */}
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>
                          <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{talent.followers || 'N/A'}</div>
                          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                            {talent.engagement_rate || 'N/A'} Eng.
                          </div>
                        </div>
                      </td>

                      {/* Internal Fee (Protected for Admin) */}
                      <td>
                        {isAdmin ? (
                          <>
                            <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>
                              {talent.internal_fee || 'Rp 15.000.000 / hari'}
                            </div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Net to Talent</span>
                          </>
                        ) : (
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Lock size={12} color="#D97706" /> <span>Confidential</span>
                          </div>
                        )}
                      </td>

                      {/* Public Rate Card */}
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--color-accent-purple-light)', fontSize: '0.9rem' }}>
                          {talent.rate_card || 'Rp 32.000.000 / hari'}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Client Invoiced</span>
                      </td>

                      {/* Gross Margin (Protected for Admin) */}
                      <td>
                        {isAdmin ? (
                          margin !== null ? (
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-sm)',
                                background: margin >= 40 ? '#D1FAE5' : '#DBEAFE',
                                color: margin >= 40 ? '#047857' : '#1D4ED8',
                                fontWeight: 700,
                                fontSize: '0.8rem'
                              }}
                            >
                              <Percent size={12} /> {margin}%
                            </div>
                          ) : (
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>&mdash;</span>
                          )
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Admin Only</span>
                        )}
                      </td>

                      {/* Status Toggle Pill */}
                      <td>
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleToggleStatus(talent)}
                          className="status-pill-btn"
                          style={{
                            background: currentStatusConfig.bg,
                            color: currentStatusConfig.color,
                            borderColor: currentStatusConfig.border
                          }}
                          title="Click to cycle status (Available -> On Shooting -> Off Duty)"
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: currentStatusConfig.color
                            }}
                          />
                          {isUpdating ? 'Updating...' : currentStatusConfig.label}
                        </button>
                      </td>

                      {/* Actions */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => onViewTalentDetails(talent)}
                            className="btn-icon"
                            title="View Public Profile Card"
                            style={{ padding: '6px' }}
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* VIEW MODE 2: Grid View */
        <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '20px' }}>
          {filteredTalents.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: 'var(--color-text-muted)' }}>
              No talents found matching your search.
            </div>
          ) : (
            filteredTalents.map((talent) => {
              const statusKey = (talent.status || 'available').toLowerCase();
              const currentStatusConfig = STATUS_CONFIG[statusKey] || STATUS_CONFIG.available;
              const margin = calculateMargin(talent.internal_fee, talent.rate_card);
              const isUpdating = statusUpdatingId === talent.id;

              return (
                <div
                  key={talent.id}
                  className="glass-card"
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                    background: '#FFFFFF'
                  }}
                >
                  <div>
                    {/* Header with Avatar, Title & Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <img
                          src={talent.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
                          alt={talent.name}
                          style={{
                            width: '54px',
                            height: '54px',
                            borderRadius: 'var(--radius-md)',
                            objectFit: 'cover',
                            border: '1px solid var(--color-border-medium)'
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-text-primary)' }}>{talent.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-accent-purple-light)', fontWeight: 600 }}>
                            {talent.category}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleToggleStatus(talent)}
                        className="status-pill-btn"
                        style={{
                          background: currentStatusConfig.bg,
                          color: currentStatusConfig.color,
                          borderColor: currentStatusConfig.border
                        }}
                        title="Click to cycle status"
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: currentStatusConfig.color
                          }}
                        />
                        {isUpdating ? '...' : currentStatusConfig.label}
                      </button>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
                      {talent.title}
                    </p>

                    {/* Rates & Margin Box */}
                    <div
                      style={{
                        background: '#F8FAFC',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border-medium)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.82rem'
                      }}
                    >
                      <div>
                        <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>Cost</span>
                        <strong style={{ color: 'var(--color-text-primary)' }}>
                          {isAdmin ? (talent.internal_fee || 'Rp 15.000.000') : '🔒 Hidden'}
                        </strong>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>Rate Card</span>
                        <strong style={{ color: 'var(--color-accent-purple-light)' }}>{talent.rate_card || 'Rp 32.000.000'}</strong>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>Margin</span>
                        <span style={{ color: '#047857', fontWeight: 800 }}>
                          {isAdmin ? (margin !== null ? `${margin}%` : 'N/A') : '🔒 Masked'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--color-border-medium)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      {talent.followers || '0'} followers &bull; {talent.engagement_rate || '0%'}
                    </div>

                    <button
                      type="button"
                      onClick={() => onViewTalentDetails(talent)}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                    >
                      <Eye size={13} /> View Card
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Add Talent Modal */}
      <AddTalentModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={handleCreated}
      />
    </div>
  );
}
