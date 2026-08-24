import React, { useState, useMemo } from 'react';
import {
  Users,
  LayoutGrid,
  List,
  Search,
  Plus,
  Filter,
  DollarSign,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronDown,
  Eye,
  Percent
} from 'lucide-react';
import { updateTalentStatus } from '../../services/api';
import AddTalentModal from './AddTalentModal';

export default function TalentRoster({
  talents = [],
  onTalentUpdated = () => {},
  onTalentCreated = () => {},
  onViewTalentDetails = () => {},
  addToast = () => {}
}) {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  // Status definition maps
  const STATUS_CONFIG = {
    available: { label: 'Available', color: '#34D399', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.35)', next: 'on_shoot' },
    on_shoot: { label: 'On Shooting', color: '#FBBF24', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.35)', next: 'unavailable' },
    unavailable: { label: 'Off Duty', color: '#FB7185', bg: 'rgba(244, 63, 94, 0.15)', border: 'rgba(244, 63, 94, 0.35)', next: 'available' }
  };

  // Helper to parse numeric fee from string (e.g. "$1,800 / day" -> 1800)
  const extractNumber = (str) => {
    if (!str) return 0;
    const match = str.toString().match(/\$?([0-9,]+)/);
    if (!match) return 0;
    const parsed = parseInt(match[1].replace(/,/g, ''), 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Calculate gross margin %
  const calculateMargin = (internalFeeStr, rateCardStr) => {
    const cost = extractNumber(internalFeeStr);
    const revenue = extractNumber(rateCardStr);
    if (!revenue || revenue <= 0 || !cost) return null;
    const margin = Math.round(((revenue - cost) / revenue) * 100);
    return margin;
  };

  // Filtered talents
  const filteredTalents = useMemo(() => {
    return talents.filter((talent) => {
      // Category filter
      if (selectedCategory !== 'All') {
        if ((talent.category || '').toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'All') {
        const tStatus = (talent.status || 'available').toLowerCase();
        if (statusFilter === 'available' && tStatus !== 'available') return false;
        if (statusFilter === 'on_shoot' && tStatus !== 'on_shoot' && tStatus !== 'booked') return false;
        if (statusFilter === 'unavailable' && tStatus !== 'unavailable' && tStatus !== 'off_duty') return false;
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const nameMatch = (talent.name || '').toLowerCase().includes(q);
        const titleMatch = (talent.title || '').toLowerCase().includes(q);
        const catMatch = (talent.category || '').toLowerCase().includes(q);
        const tags = Array.isArray(talent.niche_tags)
          ? talent.niche_tags.join(' ').toLowerCase()
          : (talent.niche_tags || '').toLowerCase();
        const tagMatch = tags.includes(q);
        return nameMatch || titleMatch || catMatch || tagMatch;
      }

      return true;
    });
  }, [talents, selectedCategory, statusFilter, searchQuery]);

  // Handle Quick Status Toggle
  const handleToggleStatus = async (talent, explicitStatus = null) => {
    const currentStatus = (talent.status || 'available').toLowerCase();
    let nextStatus = explicitStatus;
    if (!nextStatus) {
      if (currentStatus === 'available') nextStatus = 'on_shoot';
      else if (currentStatus === 'on_shoot' || currentStatus === 'booked') nextStatus = 'unavailable';
      else nextStatus = 'available';
    }

    try {
      setStatusUpdatingId(talent.id);
      const updated = await updateTalentStatus(talent.id, nextStatus);
      onTalentUpdated(updated);
      addToast({
        type: 'success',
        title: 'Talent Status Updated',
        message: `${talent.name} is now marked as ${STATUS_CONFIG[nextStatus]?.label || nextStatus}.`
      });
    } catch (err) {
      console.error('Failed to update talent status:', err);
      addToast({
        type: 'error',
        title: 'Status Update Failed',
        message: err.message || 'Could not update talent status on server'
      });
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // Handle Talent Created
  const handleTalentCreated = (newTalent) => {
    onTalentCreated(newTalent);
    addToast({
      type: 'success',
      title: 'Talent Registered!',
      message: `Successfully added ${newTalent.name} to the agency talent roster.`
    });
  };

  const categories = ['All', 'Model', 'Influencer', 'Photographer', 'Videographer', 'Designer'];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header & Action Controls */}
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
            Agency Talent Roster & Rate Management
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem' }}>
            Direct contract fee tracking, gross margin monitoring, and one-click availability status switching.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Grid vs Table View Switcher */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '4px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              border: '1px solid var(--color-border-subtle)',
              gap: '4px'
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('table')}
              title="Table View"
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                background: viewMode === 'table' ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
                color: viewMode === 'table' ? '#FFFFFF' : 'var(--color-text-secondary)',
                border: viewMode === 'table' ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <List size={16} />
            </button>

            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Grid View"
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                background: viewMode === 'grid' ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
                color: viewMode === 'grid' ? '#FFFFFF' : 'var(--color-text-secondary)',
                border: viewMode === 'grid' ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <LayoutGrid size={16} />
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

      {/* Filter & Search Bar */}
      <div
        className="glass-card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        {/* Category Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                transition: 'all var(--transition-fast)',
                background: selectedCategory === cat ? 'linear-gradient(135deg, var(--color-accent-purple) 0%, var(--color-accent-pink) 100%)' : 'rgba(255, 255, 255, 0.05)',
                color: selectedCategory === cat ? '#FFFFFF' : 'var(--color-text-secondary)',
                border: selectedCategory === cat ? '1px solid transparent' : '1px solid var(--color-border-subtle)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Status Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
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
            style={{ width: '150px', fontSize: '0.85rem', background: 'rgba(15, 23, 42, 0.9)' }}
          >
            <option value="All">All Statuses</option>
            <option value="available">🟢 Available</option>
            <option value="on_shoot">🟡 On Shooting</option>
            <option value="unavailable">🔴 Off Duty</option>
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
                              border: '1px solid var(--color-border-subtle)'
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{talent.name}</div>
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
                          <div style={{ fontWeight: 600 }}>{talent.followers || 'N/A'}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-accent-emerald-light)' }}>
                            {talent.engagement_rate || 'N/A'} Eng.
                          </div>
                        </div>
                      </td>

                      {/* Internal Fee */}
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>
                          {talent.internal_fee || '$1,500 / day'}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Net to Talent</span>
                      </td>

                      {/* Public Rate Card */}
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--color-accent-purple-light)', fontSize: '0.9rem' }}>
                          {talent.rate_card || '$3,000 / day'}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Client Invoiced</span>
                      </td>

                      {/* Gross Margin */}
                      <td>
                        {margin !== null ? (
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-sm)',
                              background: margin >= 40 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                              color: margin >= 40 ? '#34D399' : '#60A5FA',
                              fontWeight: 700,
                              fontSize: '0.8rem'
                            }}
                          >
                            <Percent size={12} /> {margin}%
                          </div>
                        ) : (
                          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>&mdash;</span>
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
                    gap: '16px'
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
                            border: '1px solid var(--color-border-subtle)'
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{talent.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-accent-purple-light)' }}>
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
                        background: 'rgba(15, 23, 42, 0.5)',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.82rem'
                      }}
                    >
                      <div>
                        <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.72rem' }}>Cost</span>
                        <strong style={{ color: 'var(--color-text-primary)' }}>{talent.internal_fee || '$1,500'}</strong>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.72rem' }}>Rate Card</span>
                        <strong style={{ color: 'var(--color-accent-purple-light)' }}>{talent.rate_card || '$3,000'}</strong>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.72rem' }}>Margin</span>
                        <span style={{ color: '#34D399', fontWeight: 700 }}>
                          {margin !== null ? `${margin}%` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--color-border-subtle)' }}>
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
        onSuccess={handleTalentCreated}
      />
    </div>
  );
}
