import React, { useState, useMemo } from 'react';
import { Search, Filter, Sparkles, X, Users, RefreshCw, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import TalentCard from './TalentCard';

export default function TalentCatalog({
  talents = [],
  loading = false,
  onSelectTalent = () => {},
  onBookTalent = () => {}
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'followers' | 'engagement' | 'name'
  const [availableOnly, setAvailableOnly] = useState(false);

  // Category filter options
  const categoryPills = [
    { id: 'All', label: 'All Talents' },
    { id: 'Influencer', label: 'Influencer' },
    { id: 'Model', label: 'Model' },
    { id: 'Creative', label: 'Creative (Photo/Video/3D)' }
  ];

  // Creative categories mapping
  const creativeCategories = ['Photographer', 'Videographer', 'Designer', 'Creative'];

  // Helper to parse follower string to numeric value for sorting
  const parseFollowerCount = (str) => {
    if (!str) return 0;
    const clean = str.toUpperCase().trim();
    if (clean.endsWith('M')) return parseFloat(clean) * 1000000;
    if (clean.endsWith('K')) return parseFloat(clean) * 1000;
    return parseFloat(clean) || 0;
  };

  // Helper to parse engagement string
  const parseEngagementRate = (str) => {
    if (!str) return 0;
    return parseFloat(str.replace('%', '')) || 0;
  };

  // Filtered & Sorted Talents
  const filteredTalents = useMemo(() => {
    return talents
      .filter((talent) => {
        // Category Filter
        if (selectedCategory === 'Creative') {
          if (!creativeCategories.includes(talent.category)) return false;
        } else if (selectedCategory !== 'All') {
          if (talent.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false;
        }

        // Availability Filter
        if (availableOnly && talent.status !== 'available') {
          return false;
        }

        // Search Query Filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const nameMatch = talent.name?.toLowerCase().includes(query);
          const titleMatch = talent.title?.toLowerCase().includes(query);
          const bioMatch = talent.bio?.toLowerCase().includes(query);
          const catMatch = talent.category?.toLowerCase().includes(query);

          let tagMatch = false;
          if (Array.isArray(talent.niche_tags)) {
            tagMatch = talent.niche_tags.some((t) => String(t).toLowerCase().includes(query));
          } else if (typeof talent.niche_tags === 'string') {
            tagMatch = talent.niche_tags.toLowerCase().includes(query);
          }

          if (!nameMatch && !titleMatch && !bioMatch && !catMatch && !tagMatch) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'followers') {
          return parseFollowerCount(b.followers) - parseFollowerCount(a.followers);
        }
        if (sortBy === 'engagement') {
          return parseEngagementRate(b.engagement_rate) - parseEngagementRate(a.engagement_rate);
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return (a.id || 0) - (b.id || 0);
      });
  }, [talents, selectedCategory, searchQuery, sortBy, availableOnly]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('featured');
    setAvailableOnly(false);
  };

  return (
    <section id="talents-catalog" style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '32px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              className="badge badge-tag"
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Users size={13} /> Official Agency Roster
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              ({filteredTalents.length} {filteredTalents.length === 1 ? 'Talent' : 'Talents'} matching)
            </span>
          </div>

          <h2
            className="font-heading"
            style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.35rem)',
              lineHeight: 1.2
            }}
          >
            Explore Curated <span className="text-gradient-purple-pink">Creator Roster</span>
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', maxWidth: '650px' }}>
            Filter by niche specialty, review verified engagement analytics, inspect rate cards, and book immediately.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div
          className="glass-panel"
          style={{
            padding: '18px 22px',
            marginBottom: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {/* Top Row: Search Input & Sort & Status Toggle */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '14px',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            {/* Search Input */}
            <div
              style={{
                position: 'relative',
                flex: '1 1 300px',
                minWidth: '240px'
              }}
            >
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                  pointerEvents: 'none'
                }}
              />
              <input
                type="text"
                placeholder="Search talent by name, niche (#Streetwear, #Editorial), or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input"
                style={{
                  paddingLeft: '42px',
                  paddingRight: searchQuery ? '38px' : '14px',
                  height: '44px'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Right Controls: Sort Dropdown & Availability Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              {/* Sort By Select */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-subtle)'
                }}
              >
                <ArrowUpDown size={14} color="var(--color-text-muted)" />
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="featured" style={{ background: '#1E293B', color: '#F8FAFC' }}>
                    Featured
                  </option>
                  <option value="followers" style={{ background: '#1E293B', color: '#F8FAFC' }}>
                    Most Followers
                  </option>
                  <option value="engagement" style={{ background: '#1E293B', color: '#F8FAFC' }}>
                    Highest Engagement
                  </option>
                  <option value="name" style={{ background: '#1E293B', color: '#F8FAFC' }}>
                    Name (A-Z)
                  </option>
                </select>
              </div>

              {/* Available Only Toggle */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: availableOnly ? 'var(--color-accent-emerald-light)' : 'var(--color-text-secondary)',
                  userSelect: 'none'
                }}
              >
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  style={{
                    accentColor: 'var(--color-accent-emerald)',
                    cursor: 'pointer',
                    width: '16px',
                    height: '16px'
                  }}
                />
                Available Only
              </label>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap',
              borderTop: '1px solid var(--color-border-subtle)',
              paddingTop: '14px'
            }}
          >
            <span
              style={{
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginRight: '4px'
              }}
            >
              Categories:
            </span>

            {categoryPills.map((pill) => {
              const isActive = selectedCategory === pill.id;
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setSelectedCategory(pill.id)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    transition: 'all var(--transition-fast)',
                    cursor: 'pointer',
                    background: isActive
                      ? 'linear-gradient(135deg, var(--color-accent-purple) 0%, var(--color-accent-pink) 100%)'
                      : 'rgba(255, 255, 255, 0.05)',
                    color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                    border: isActive
                      ? '1px solid rgba(236, 72, 153, 0.4)'
                      : '1px solid var(--color-border-subtle)',
                    boxShadow: isActive ? 'var(--shadow-glow-purple)' : 'none'
                  }}
                >
                  {pill.label}
                </button>
              );
            })}

            {(selectedCategory !== 'All' || searchQuery || availableOnly || sortBy !== 'featured') && (
              <button
                type="button"
                onClick={handleResetFilters}
                style={{
                  marginLeft: 'auto',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-accent-pink)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RefreshCw size={12} /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div
            style={{
              padding: '60px 0',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px'
            }}
          >
            <div
              className="animate-pulse-glow"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, var(--color-accent-purple) 0%, var(--color-accent-pink) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles size={24} color="#FFFFFF" />
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
              Fetching verified talent roster from database...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredTalents.length === 0 && (
          <div
            className="glass-card"
            style={{
              padding: '60px 24px',
              textAlign: 'center',
              maxWidth: '520px',
              margin: '0 auto'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(236, 72, 153, 0.15)',
                color: 'var(--color-accent-pink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <Search size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No Talents Match Your Criteria</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Try adjusting your category filter, clearing your search query, or checking back later.
            </p>
            <button type="button" onClick={handleResetFilters} className="btn btn-primary btn-sm">
              <RefreshCw size={14} /> Clear All Filters
            </button>
          </div>
        )}

        {/* Talent Grid */}
        {!loading && filteredTalents.length > 0 && (
          <div
            className="grid-responsive"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '28px'
            }}
          >
            {filteredTalents.map((talent) => (
              <TalentCard
                key={talent.id}
                talent={talent}
                onViewDetails={onSelectTalent}
                onBookTalent={onBookTalent}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
