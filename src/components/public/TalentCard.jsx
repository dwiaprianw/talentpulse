import React from 'react';
import { Sparkles, Users, TrendingUp, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';

export default function TalentCard({
  talent,
  onViewDetails = () => {},
  onBookTalent = () => {}
}) {
  if (!talent) return null;

  const nicheTags = Array.isArray(talent.niche_tags)
    ? talent.niche_tags
    : typeof talent.niche_tags === 'string'
    ? JSON.parse(talent.niche_tags || '[]')
    : [];

  const categoryBadgeColors = {
    Model: { bg: '#F3E8FF', color: '#6B21A8', border: '#E9D5FF' },
    Influencer: { bg: '#DBEAFE', color: '#1E40AF', border: '#93C5FD' },
    Photographer: { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
    Videographer: { bg: '#FCE7F3', color: '#9D174D', border: '#FBCFE8' },
    Designer: { bg: '#D1FAE5', color: '#065F46', border: '#A7F3D0' }
  };

  const catStyle = categoryBadgeColors[talent.category] || categoryBadgeColors.Model;

  const isAvailable = (talent.status || 'available').toLowerCase() === 'available';
  const rateDisplay = typeof talent.rate_card === 'string' ? talent.rate_card : 'Rp 35.000.000 / hari';

  return (
    <div
      className="glass-card glass-card-hover animate-scale-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        background: '#FFFFFF',
        border: '1px solid var(--color-border-medium)',
        boxShadow: 'var(--shadow-md)'
      }}
    >
      {/* Media Header / Avatar Banner */}
      <div
        style={{
          position: 'relative',
          paddingTop: '90%',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#F1F5F9'
        }}
      >
        <img
          src={talent.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
          alt={talent.name}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        />

        {/* Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, transparent 40%, rgba(15, 23, 42, 0.75) 100%)',
            pointerEvents: 'none'
          }}
        />

        {/* Top Badges */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 2
          }}
        >
          {/* Category Badge */}
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              background: catStyle.bg,
              color: catStyle.color,
              border: `1px solid ${catStyle.border}`
            }}
          >
            {talent.category}
          </span>

          {/* Live Availability Status */}
          <span className={`badge ${isAvailable ? 'badge-available' : 'badge-booked'}`}>
            {isAvailable ? <CheckCircle2 size={12} /> : <Clock size={12} />}
            {isAvailable ? 'Available' : 'On Shoot'}
          </span>
        </div>

        {/* Talent Name & Title Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '16px',
            right: '16px',
            zIndex: 2,
            color: '#FFFFFF'
          }}
        >
          <h3
            className="font-heading"
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: '2px',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)'
            }}
          >
            {talent.name}
          </h3>
          <p
            style={{
              fontSize: '0.82rem',
              color: 'rgba(255, 255, 255, 0.9)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontWeight: 500
            }}
          >
            {talent.title}
          </p>
        </div>
      </div>

      {/* Card Content & Metrics */}
      <div
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
          gap: '14px'
        }}
      >
        {/* Niche Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {nicheTags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="badge badge-tag"
              style={{
                fontSize: '0.72rem',
                padding: '2px 8px'
              }}
            >
              #{tag}
            </span>
          ))}
          {nicheTags.length > 3 && (
            <span
              className="badge badge-tag"
              style={{
                fontSize: '0.72rem',
                padding: '2px 6px',
                color: 'var(--color-text-muted)'
              }}
            >
              +{nicheTags.length - 3}
            </span>
          )}
        </div>

        {/* Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            background: '#F8FAFC',
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-medium)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Followers
            </div>
            <div
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--color-accent-purple-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <Users size={12} /> {talent.followers || '—'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Engage
            </div>
            <div
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <TrendingUp size={12} /> {talent.engagement_rate || '—'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              From Rate
            </div>
            <div
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#D97706',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
              title={rateDisplay}
            >
              {rateDisplay.split('/')[0]?.trim() || rateDisplay}
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '2px' }}>
          <button
            type="button"
            onClick={() => onViewDetails(talent)}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%' }}
          >
            Profile <ArrowUpRight size={14} />
          </button>

          <button
            type="button"
            onClick={() => onBookTalent(talent)}
            className="btn btn-primary btn-sm"
            style={{ width: '100%' }}
          >
            <Sparkles size={14} /> Book
          </button>
        </div>
      </div>
    </div>
  );
}
