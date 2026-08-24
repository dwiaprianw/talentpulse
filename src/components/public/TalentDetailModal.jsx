import React, { useEffect } from 'react';
import {
  X,
  Sparkles,
  Users,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Shield,
  Clock,
  Ban,
  Camera,
  Star,
  Check
} from 'lucide-react';

export default function TalentDetailModal({
  talent,
  isOpen = false,
  onClose = () => {},
  onBookTalent = () => {}
}) {
  // Handle ESC key close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !talent) return null;

  // Safe niche tags parser
  const nicheTags = Array.isArray(talent.niche_tags)
    ? talent.niche_tags
    : typeof talent.niche_tags === 'string'
    ? talent.niche_tags.replace(/[[\]"]/g, '').split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  // Curated portfolio gallery based on talent category
  const portfolioGallery = [
    talent.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    talent.category === 'Model'
      ? 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
      : talent.category === 'Influencer'
      ? 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80'
      : talent.category === 'Photographer'
      ? 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80'
      : talent.category === 'Videographer'
      ? 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80'
      : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'
  ];

  // Base rate string
  const baseRateStr = typeof talent.rate_card === 'string' ? talent.rate_card : '$3,500 / day';

  // Tier Packages
  const rateTiers = [
    {
      name: 'Essential Post / Half-Day',
      price: baseRateStr.includes('$') ? baseRateStr.split('/')[0].trim() : '$2,500',
      period: 'per deliverable',
      description: 'Ideal for targeted social promotions, editorial single look, or focused studio shoot.',
      features: [
        '1x High-impact hero asset or 4hr session',
        'Standard digital usage license (3 months)',
        'Direct creative coordination with agent',
        'High-resolution raw & color-graded delivery'
      ],
      popular: false
    },
    {
      name: 'Full Campaign & Commercial',
      price: baseRateStr.includes('$')
        ? `$${parseInt(baseRateStr.replace(/[^0-9]/g, '') || '3500', 10) * 2}`
        : '$5,800',
      period: 'full package',
      description: 'Comprehensive brand storytelling, multi-channel rights, and premier placement.',
      features: [
        '3x Reel/TikTok deliverables or full-day shoot',
        'Extended global digital & print buyout (1 year)',
        'Full moodboard & pre-production alignment',
        'Priority 48-hour post-production turnaround'
      ],
      popular: true
    }
  ];

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="talent-detail-title"
    >
      <div
        className="glass-panel animate-scale-in"
        style={{
          width: '100%',
          maxWidth: '860px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '32px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), var(--shadow-glow-purple)'
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--color-border-subtle)',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-secondary)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          }}
        >
          <X size={18} />
        </button>

        {/* Talent Profile Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
            alignItems: 'flex-start',
            marginBottom: '28px',
            borderBottom: '1px solid var(--color-border-subtle)',
            paddingBottom: '24px'
          }}
        >
          {/* Avatar Thumbnail */}
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              flexShrink: 0,
              border: '2px solid var(--color-accent-purple)',
              boxShadow: 'var(--shadow-glow-purple)',
              backgroundColor: '#1e293b'
            }}
          >
            <img
              src={talent.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
              alt={talent.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Info & Badges */}
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <h2
                id="talent-detail-title"
                className="font-heading"
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.1
                }}
              >
                {talent.name}
              </h2>
              <span
                style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  background: 'rgba(139, 92, 246, 0.15)',
                  color: 'var(--color-accent-purple-light)',
                  border: '1px solid rgba(139, 92, 246, 0.3)'
                }}
              >
                {talent.category}
              </span>
              <span className={`badge ${talent.status === 'available' ? 'badge-available' : 'badge-booked'}`}>
                {talent.status === 'available' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                {talent.status || 'Available'}
              </span>
            </div>

            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              {talent.title}
            </p>

            {/* Niche Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {nicheTags.map((tag, idx) => (
                <span key={idx} className="badge badge-tag" style={{ padding: '3px 10px' }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics & Metrics Ribbon */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
            marginBottom: '28px'
          }}
        >
          <div className="glass-card" style={{ padding: '14px 18px', background: 'rgba(30, 41, 59, 0.5)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Audience / Reach
            </div>
            <div
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: 'var(--color-accent-purple-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Users size={16} /> {talent.followers || '—'}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '14px 18px', background: 'rgba(30, 41, 59, 0.5)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Avg Engagement
            </div>
            <div
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: 'var(--color-accent-emerald-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <TrendingUp size={16} /> {talent.engagement_rate || '—'}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '14px 18px', background: 'rgba(30, 41, 59, 0.5)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Starting Rate
            </div>
            <div
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: 'var(--color-accent-amber-light)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {baseRateStr}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '14px 18px', background: 'rgba(30, 41, 59, 0.5)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Agency Status
            </div>
            <div
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#34D399',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Shield size={16} /> Vetted & Verified
            </div>
          </div>
        </div>

        {/* Bio & Background */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
            About & Experience
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.65, fontSize: '0.95rem' }}>
            {talent.bio || 'High-caliber talent represented by TalentPulse Agency with proven track record across leading campaigns.'}
          </p>
        </div>

        {/* Portfolio Gallery Showcase */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text-primary)' }}>
              Featured Work & Portfolio
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              High-Res Campaign Visuals
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px'
            }}
          >
            {portfolioGallery.map((imgUrl, idx) => (
              <div
                key={idx}
                style={{
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  position: 'relative',
                  paddingTop: '100%',
                  background: '#1e293b',
                  border: '1px solid var(--color-border-subtle)'
                }}
              >
                <img
                  src={imgUrl}
                  alt={`Portfolio ${idx + 1}`}
                  loading="lazy"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Rate Card Tier Packages */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '14px', color: 'var(--color-text-primary)' }}>
            Transparent Rate Card & Package Tiers
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px'
            }}
          >
            {rateTiers.map((tier, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: '20px',
                  position: 'relative',
                  border: tier.popular ? '1px solid rgba(236, 72, 153, 0.5)' : '1px solid var(--color-border-subtle)',
                  background: tier.popular ? 'rgba(236, 72, 153, 0.06)' : 'rgba(30, 41, 59, 0.5)'
                }}
              >
                {tier.popular && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '16px',
                      padding: '2px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, var(--color-accent-pink) 0%, var(--color-accent-purple) 100%)',
                      color: '#FFFFFF',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    Most Requested
                  </span>
                )}

                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                  {tier.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
                  <span
                    className="font-heading"
                    style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-accent-pink)' }}
                  >
                    {tier.price}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{tier.period}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
                  {tier.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {tier.features.map((feat, fIdx) => (
                    <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--color-text-primary)' }}>
                      <Check size={14} color="#34D399" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Action Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '14px',
            borderTop: '1px solid var(--color-border-subtle)',
            paddingTop: '20px'
          }}
        >
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Close Profile
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onBookTalent(talent);
            }}
            className="btn btn-primary"
          >
            <Sparkles size={16} /> Book {talent.name.split(' ')[0]} Now <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
