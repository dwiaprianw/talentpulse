import React from 'react';
import { Sparkles, ArrowRight, Star, Flame, Zap, Award, Search } from 'lucide-react';

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
      icon: <Flame size={20} color="#EC4899" />,
      glowBg: '#FCE7F3'
    },
    {
      label: 'Campaigns Delivered',
      value: '250+',
      sub: 'Across luxury, tech & fashion',
      icon: <Award size={20} color="#8B5CF6" />,
      glowBg: '#F3E8FF'
    },
    {
      label: 'Verified Retention',
      value: '98.6%',
      sub: 'Repeat brand satisfaction',
      icon: <Star size={20} color="#D97706" />,
      glowBg: '#FEF3C7'
    },
    {
      label: 'Fast Production Booking',
      value: '24-48h',
      sub: 'Guaranteed talent clearance',
      icon: <Zap size={20} color="#059669" />,
      glowBg: '#D1FAE5'
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
              background: '#F3E8FF',
              border: '1px solid #E9D5FF',
              borderRadius: 'var(--radius-full)',
              color: '#6D28D9',
              fontSize: '0.875rem',
              fontWeight: 700,
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Sparkles size={16} className="animate-pulse-glow" color="#8B5CF6" />
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
              color: 'var(--color-text-primary)',
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
                background: '#FFFFFF',
                border: '1px solid var(--color-border-medium)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-md)',
                  background: item.glowBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
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
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    marginTop: '2px'
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: '0.76rem',
                    color: 'var(--color-text-secondary)',
                    marginTop: '2px',
                    fontWeight: 500
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
