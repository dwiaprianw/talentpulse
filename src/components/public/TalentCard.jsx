import React from 'react';
import { Users, TrendingUp, DollarSign, ArrowUpRight, Sparkles, CheckCircle2, Clock, Ban } from 'lucide-react';

export default function TalentCard({
  talent,
  onViewDetails = () => {},
  onBookTalent = () => {}
}) {
  if (!talent) return null;

  // Safe niche tags parser
  const nicheTags = Array.isArray(talent.niche_tags)
    ? talent.niche_tags
    : typeof talent.niche_tags === 'string'
    ? talent.niche_tags.replace(/[[\]"]/g, '').split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  // Status badge config
  const statusConfig = {
    available: {
      label: 'Available',
      icon: <CheckCircle2 size={12} />,
      className: 'badge-available'
    },
    on_shoot: {
      label: 'On Shoot',
      icon: <Clock size={12} />,
      className: 'badge-booked'
    },
    booked: {
      label: 'Booked',
      icon: <Clock size={12} />,
      className: 'badge-booked'
    },
    unavailable: {
      label: 'Unavailable',
      icon: <Ban size={12} />,
      className: 'badge-unavailable'
    }
  };

  const currentStatus = statusConfig[talent.status] || statusConfig.available;

  // Category badge colors
  const categoryThemes = {
    Model: { bg: 'rgba(236, 72, 153, 0.15)', text: '#F472B6', border: 'rgba(236, 72, 153, 0.3)' },
    Influencer: { bg: 'rgba(139, 92, 246, 0.15)', text: '#C4B5FD', border: 'rgba(139, 92, 246, 0.3)' },
    Photographer: { bg: 'rgba(59, 130, 246, 0.15)', text: '#93C5FD', border: 'rgba(59, 130, 246, 0.3)' },
    Videographer: { bg: 'rgba(245, 158, 11, 0.15)', text: '#FCD34D', border: 'rgba(245, 158, 11, 0.3)' },
    Designer: { bg: 'rgba(16, 185, 129, 0.15)', text: '#6EE7B7', border: 'rgba(16, 185, 129, 0.3)' }
  };

  const catStyle = categoryThemes[talent.category] || {
    bg: 'rgba(148, 163, 184, 0.15)',
    text: '#CBD5E1',
    border: 'rgba(148, 163, 184, 0.3)'
  };

  // Format rate card string
  const rateDisplay =
    typeof talent.rate_card === 'string'
      ? talent.rate_card
      : talent.rate_card?.starter || talent.rate_card?.rate || '$3,000 / day';

  return (
    <div
      className="glass-card animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        transition: 'all var(--transition-normal)'
      }}
    >
      {/* Talent Image Header with Overlays */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '92%', // ~1:1 aspect ratio
          overflow: 'hidden',
          backgroundColor: '#1e293b'
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
            objectPosition: 'top center',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        />

        {/* Gradient Scrim for Readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.4) 60%, rgba(15,23,42,0.92) 100%)',
            pointerEvents: 'none'
          }}
        />

        {/* Top Badges (Category & Status) */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            right: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 2
          }}
        >
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              background: catStyle.bg,
              color: catStyle.text,
              border: `1px solid ${catStyle.border}`,
              backdropFilter: 'blur(8px)'
            }}
          >
            {talent.category}
          </span>

          <span
            className={`badge ${currentStatus.className}`}
            style={{
              backdropFilter: 'blur(8px)',
              fontSize: '0.7rem',
              fontWeight: 600
            }}
          >
            {currentStatus.icon} {currentStatus.label}
          </span>
        </div>

        {/* Talent Name & Title floating at bottom of image */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '16px',
            right: '16px',
            zIndex: 2
          }}
        >
          <h3
            className="font-heading"
            style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.2,
              marginBottom: '2px'
            }}
          >
            {talent.name}
          </h3>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {talent.title}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div
        style={{
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
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
            background: 'rgba(15, 23, 42, 0.4)',
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-subtle)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
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
            <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Engage
            </div>
            <div
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--color-accent-emerald-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <TrendingUp size={12} /> {talent.engagement_rate || '—'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              From Rate
            </div>
            <div
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--color-accent-amber-light)',
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
