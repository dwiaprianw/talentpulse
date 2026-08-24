import React from 'react';
import { Sparkles, ArrowRight, Star, ShieldCheck, Flame, Zap, Award, Search } from 'lucide-react';

export default function HeroBanner({
  onExploreRoster = () => {},
  onOpenInquiry = () => {},
  stats = null
}) {
  const highlights = [
    {
      label: 'Vetted Top Talents',
      value: stats?.totalTalents ? `${stats.totalTalents}+` : '50+',
      sub: 'Global creators & models',
      icon: <Flame size={18} color="#EC4899" />
    },
    {
      label: 'Campaigns Delivered',
      value: '250+',
      sub: 'Across luxury, tech & fashion',
      icon: <Award size={18} color="#8B5CF6" />
    },
    {
      label: 'Verified Retention',
      value: '98.6%',
      sub: 'Repeat brand satisfaction',
      icon: <Star size={18} color="#F59E0B" />
    },
    {
      label: 'Fast Production Booking',
      value: '24-48h',
      sub: 'Guaranteed talent clearance',
      icon: <Zap size={18} color="#10B981" />
    }
  ];

  return (
    <section
      style={{
        position: 'relative',
        padding: '56px 0 36px 0',
        overflow: 'hidden'
      }}
    >
      <div className="container">
        {/* Top Feature Pill */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div
            className="animate-slide-down"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              background: 'rgba(139, 92, 246, 0.12)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--color-accent-purple-light)',
              fontSize: '0.875rem',
              fontWeight: 600,
              boxShadow: 'var(--shadow-glow-purple)'
            }}
          >
            <Sparkles size={16} className="animate-pulse-glow" />
            <span>Curated Creative Talent Management & Production Roster</span>
          </div>
        </div>

        {/* Main Headline */}
        <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 28px' }}>
          <h1
            className="font-heading animate-slide-up"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
              lineHeight: 1.12,
              fontWeight: 800,
              marginBottom: '20px'
            }}
          >
            Discover & Book Elite <br />
            <span className="text-gradient-vibrant">Visionary Talents</span> for Global Brands
          </h1>
          <p
            className="animate-slide-up"
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              maxWidth: '720px',
              margin: '0 auto'
            }}
          >
            From high-fashion runway icons and top-tier influencers to master cinematographers and 3D visual artists.
            Seamless agency bookings with transparent rates and end-to-end production management.
          </p>
        </div>

        {/* CTAs */}
        <div
          className="animate-slide-up"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '52px'
          }}
        >
          <button
            type="button"
            onClick={onExploreRoster}
            className="btn btn-primary btn-lg"
          >
            <Search size={18} /> Explore Talent Roster
          </button>
          <button
            type="button"
            onClick={onOpenInquiry}
            className="btn btn-secondary btn-lg"
          >
            Submit Campaign Brief <ArrowRight size={18} />
          </button>
        </div>

        {/* Highlights Stats Ribbon */}
        <div
          className="grid-responsive animate-fade-in"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px'
          }}
        >
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                background: 'rgba(30, 41, 59, 0.65)',
                border: '1px solid var(--color-border-subtle)'
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid var(--color-border-subtle)'
                }}
              >
                {item.icon}
              </div>
              <div>
                <div
                  className="font-heading"
                  style={{
                    fontSize: '1.65rem',
                    fontWeight: 800,
                    lineHeight: 1.1,
                    color: 'var(--color-text-primary)'
                  }}
                >
                  {item.value}
                </div>
                <div
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    marginTop: '2px'
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    marginTop: '1px'
                  }}
                >
                  {item.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
