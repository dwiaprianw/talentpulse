import React, { useEffect } from 'react';
import { X, Sparkles, Check, ArrowRight, Shield, CheckCircle2, Clock, Users, TrendingUp } from 'lucide-react';

export default function TalentDetailModal({
  isOpen = false,
  onClose = () => {},
  talent = null,
  onBookTalent = () => {}
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !talent) return null;

  // Safe parsing of niche tags
  const nicheTags = Array.isArray(talent.niche_tags)
    ? talent.niche_tags
    : typeof talent.niche_tags === 'string'
    ? JSON.parse(talent.niche_tags || '[]')
    : [];

  // Default Rate Card Tiers if string or missing
  const rateTiers = [
    {
      name: 'Single Post & Story Package',
      price: 'Rp 15.000.000',
      period: 'per kampanye',
      description: '1 Dedicated Feed/Reel Post + 2 High-Engagement Instagram Stories dengan link sticker.',
      features: ['High-Res Content Delivery', 'Brand Tagging & Hashtag Specs', '30-Day Digital Usage Rights'],
      popular: false
    },
    {
      name: 'Full Campaign & Production',
      price: 'Rp 35.000.000',
      period: 'full day shoot',
      description: 'Full-day photoshoot atau produksi video + 3 deliverable sosial + periode eksklusivitas.',
      features: ['Full Day On-Set Production', 'Multiple Outfit & Style Changes', '90-Day Digital & Paid Ad Rights', 'Raw Footages Included'],
      popular: true
    }
  ];

  // Base Rate Display
  const baseRateStr = typeof talent.rate_card === 'string' 
    ? talent.rate_card 
    : 'Rp 35.000.000 / proyek';

  // Gallery Placeholders
  const portfolioGallery = [
    talent.avatar_url,
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'
  ];

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-panel animate-scale-in"
        style={{
          width: '100%',
          maxWidth: '840px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          background: '#FFFFFF',
          border: '1px solid var(--color-border-medium)',
          boxShadow: 'var(--shadow-xl)'
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="talent-detail-title"
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '24px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              className="badge badge-tag"
              style={{
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                padding: '4px 12px'
              }}
            >
              ✨ Talent Dossier & Profile
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-icon"
            style={{ borderRadius: 'var(--radius-full)' }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Talent Hero Overview Section */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
            alignItems: 'center',
            marginBottom: '28px'
          }}
        >
          {/* Avatar Image */}
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              flexShrink: 0,
              border: '2px solid var(--color-border-medium)',
              boxShadow: 'var(--shadow-md)'
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
                  background: '#F3E8FF',
                  color: '#6B21A8',
                  border: '1px solid #E9D5FF'
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
          <div className="glass-card" style={{ padding: '14px 18px', background: '#F8FAFC' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
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

          <div className="glass-card" style={{ padding: '14px 18px', background: '#F8FAFC' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Avg Engagement
            </div>
            <div
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <TrendingUp size={16} /> {talent.engagement_rate || '—'}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '14px 18px', background: '#F8FAFC' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Starting Rate
            </div>
            <div
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#D97706',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {baseRateStr}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '14px 18px', background: '#F8FAFC' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Agency Status
            </div>
            <div
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#059669',
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
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
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
                  background: '#F1F5F9',
                  border: '1px solid var(--color-border-medium)'
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
                  border: tier.popular ? '2px solid #EC4899' : '1px solid var(--color-border-medium)',
                  background: tier.popular ? '#FDF2F8' : '#F8FAFC'
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
                    style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-accent-pink-light)' }}
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
                      <Check size={14} color="#059669" />
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
            borderTop: '1px solid var(--color-border-medium)',
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
