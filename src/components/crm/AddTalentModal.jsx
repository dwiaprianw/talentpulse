import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { createTalent } from '../../services/api';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
];

export default function AddTalentModal({
  isOpen = false,
  onClose = () => {},
  onSuccess = () => {}
}) {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    category: 'Model',
    avatar_url: PRESET_AVATARS[0],
    bio: '',
    niche_tags: 'Editorial, Commercial, Fashion',
    followers: '250K',
    engagement_rate: '5.8%',
    internal_fee: 'Rp 15.000.000 / hari',
    rate_card: 'Rp 32.000.000 / hari',
    status: 'available'
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectPresetAvatar = (url) => {
    setFormData((prev) => ({ ...prev, avatar_url: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.title.trim()) {
      setError('Nama lengkap talent dan profesi/spesialisasi wajib diisi.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const tags = formData.niche_tags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name.trim(),
        title: formData.title.trim(),
        category: formData.category,
        avatar_url: formData.avatar_url.trim() || PRESET_AVATARS[0],
        bio: formData.bio.trim() || `${formData.title} represented by TalentPulse Agency.`,
        niche_tags: tags,
        followers: formData.followers.trim() || '100K',
        engagement_rate: formData.engagement_rate.trim() || '5.0%',
        internal_fee: formData.internal_fee.trim() || 'Rp 15.000.000 / hari',
        rate_card: formData.rate_card.trim() || 'Rp 32.000.000 / hari',
        status: formData.status
      };

      const created = await createTalent(payload);
      onSuccess(created);
      onClose();
    } catch (err) {
      console.error('Error adding talent:', err);
      setError(err.message || 'Gagal meregistrasi talent ke database');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel animate-scale-in"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          background: '#FFFFFF',
          border: '1px solid var(--color-border-medium)',
          boxShadow: 'var(--shadow-xl)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--color-accent-purple) 0%, var(--color-accent-pink) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}
            >
              <UserPlus size={22} />
            </div>
            <div>
              <h2 className="font-heading" style={{ fontSize: '1.4rem', color: 'var(--color-text-primary)' }}>
                Registrasi Talent Baru
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem' }}>
                Tambahkan kreator atau model baru ke dalam database roster agency
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-icon"
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: '#FFE4E6',
              border: '1px solid #FECDD3',
              color: '#BE123C',
              fontSize: '0.88rem',
              marginBottom: '20px'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Row 1: Name & Category */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Nama Lengkap / Stage Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="misal: Chloe Valentine"
                required
                className="glass-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Kategori Talent *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="glass-input"
                style={{ background: '#FFFFFF', color: '#0F172A' }}
              >
                <option value="Model">Model (Runway & Editorial)</option>
                <option value="Influencer">Influencer & Creator</option>
                <option value="Photographer">Photographer</option>
                <option value="Videographer">Videographer & Drone DP</option>
                <option value="Designer">Designer & 3D Artist</option>
                <option value="Athlete">Athlete & Fitness Ambassador</option>
              </select>
            </div>
          </div>

          {/* Row 2: Title & Status */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Profesi / Spesialisasi *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="misal: Model Editorial & Commercial Model"
                required
                className="glass-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Status Awal Availability
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="glass-input"
                style={{ background: '#FFFFFF', color: '#0F172A' }}
              >
                <option value="available">🟢 Available (Siap booking)</option>
                <option value="on_shoot">🟡 On Shooting (Sedang ada proyek)</option>
                <option value="unavailable">🔴 Off Duty / Tidak tersedia</option>
              </select>
            </div>
          </div>

          {/* Row 3: Avatar Presets & Custom URL */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              Foto Profil Avatar (Pilih Preset atau Masukkan URL)
            </label>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '8px' }}>
              {PRESET_AVATARS.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Preset ${idx + 1}`}
                  onClick={() => handleSelectPresetAvatar(url)}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: formData.avatar_url === url ? '2px solid var(--color-accent-purple)' : '2px solid transparent',
                    opacity: formData.avatar_url === url ? 1 : 0.65,
                    transition: 'all var(--transition-fast)',
                    flexShrink: 0
                  }}
                />
              ))}
            </div>
            <input
              type="url"
              name="avatar_url"
              value={formData.avatar_url}
              onChange={handleChange}
              placeholder="Atau tempel URL gambar kustom"
              className="glass-input"
              style={{ fontSize: '0.85rem' }}
            />
          </div>

          {/* Row 4: Bio */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
              Bio & Catatan Pengalaman
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={2}
              placeholder="Bio singkat mengenai pengalaman editorial, kolaborasi brand terdahulu, dan gaya khas..."
              className="glass-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Row 5: Niche Tags */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
              Niche Tags (pisahkan dengan koma)
            </label>
            <input
              type="text"
              name="niche_tags"
              value={formData.niche_tags}
              onChange={handleChange}
              placeholder="misal: High Fashion, Editorial, Runway, Luxury"
              className="glass-input"
            />
          </div>

          {/* Row 6: Metrics & Rates (4 columns) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                Followers
              </label>
              <input
                type="text"
                name="followers"
                value={formData.followers}
                onChange={handleChange}
                placeholder="420K"
                className="glass-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                Engagement
              </label>
              <input
                type="text"
                name="engagement_rate"
                value={formData.engagement_rate}
                onChange={handleChange}
                placeholder="6.4%"
                className="glass-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                Internal Fee (Modal)
              </label>
              <input
                type="text"
                name="internal_fee"
                value={formData.internal_fee}
                onChange={handleChange}
                placeholder="Rp 18.000.000 / hari"
                className="glass-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                Public Rate Card
              </label>
              <input
                type="text"
                name="rate_card"
                value={formData.rate_card}
                onChange={handleChange}
                placeholder="Rp 35.000.000 / hari"
                className="glass-input"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '12px',
              paddingTop: '16px',
              borderTop: '1px solid var(--color-border-medium)'
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Batal
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ minWidth: '150px' }}
            >
              {submitting ? 'Mendaftarkan...' : 'Simpan Talent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
