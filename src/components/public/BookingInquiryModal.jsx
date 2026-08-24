import React, { useState } from 'react';
import { X, Send, Building2, User, Mail, Phone, Calendar, Wallet, Briefcase, Sparkles, AlertCircle } from 'lucide-react';
import { createBookingInquiry } from '../../services/api';

const projectTypes = [
  'Social Media Campaign',
  'Commercial / TVC',
  'Photoshoot & Lookbook',
  'Event Appearance & Hosting',
  'Design & Creative Consulting',
  'Long-Term Ambassador'
];

const budgetRanges = [
  '< Rp 25.000.000',
  'Rp 25.000.000 - Rp 50.000.000',
  'Rp 50.000.000 - Rp 100.000.000',
  'Rp 100.000.000 - Rp 250.000.000',
  'Rp 250.000.000+'
];

export default function BookingInquiryModal({
  isOpen = false,
  onClose = () => {},
  selectedTalent = null,
  allTalents = [],
  onSuccess = () => {}
}) {
  const [formData, setFormData] = useState({
    brand_name: '',
    contact_person: '',
    email: '',
    phone: '',
    project_title: '',
    project_type: 'Social Media Campaign',
    target_date: '',
    budget_range: 'Rp 50.000.000 - Rp 100.000.000',
    talent_id: selectedTalent?.id || '',
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.brand_name.trim() || !formData.contact_person.trim() || !formData.email.trim() || !formData.project_title.trim()) {
      setError('Mohon lengkapi semua kolom wajib (Nama Brand, Person, Email, dan Judul Proyek).');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        brand_name: formData.brand_name.trim(),
        contact_person: formData.contact_person.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        project_title: formData.project_title.trim(),
        project_type: formData.project_type,
        target_date: formData.target_date,
        budget_range: formData.budget_range,
        talent_id: formData.talent_id || (selectedTalent ? selectedTalent.id : null),
        status_stage: 'new_lead',
        notes: formData.notes.trim()
      };

      const createdProject = await createBookingInquiry(payload);
      onSuccess(createdProject, formData);
      onClose();
    } catch (err) {
      console.error('Error submitting booking inquiry:', err);
      setError(err.message || 'Gagal mengirimkan pengajuan. Silakan coba lagi.');
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
              <Sparkles size={22} />
            </div>
            <div>
              <h2 className="font-heading" style={{ fontSize: '1.4rem', color: 'var(--color-text-primary)' }}>
                Form Pengajuan Booking Talent
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.84rem' }}>
                Kirimkan brief kampanye brand Anda dan tim agency akan segera menghubungi
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

        {/* Selected Talent Card Header (If preselected) */}
        {selectedTalent && (
          <div
            style={{
              marginBottom: '20px',
              padding: '12px 16px',
              background: '#F3E8FF',
              border: '1px solid #D8B4FE',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <img
              src={selectedTalent.avatar_url}
              alt={selectedTalent.name}
              style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#4C1D95' }}>
                Pilihan Talent: {selectedTalent.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6B21A8', fontWeight: 600 }}>
                {selectedTalent.category} &bull; Rate card: {typeof selectedTalent.rate_card === 'string' ? selectedTalent.rate_card : 'Rp 35.000.000 / hari'}
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div
            className="animate-slide-up"
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: '#FFE4E6',
              border: '1px solid #FECDD3',
              color: '#BE123C',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            {/* Brand Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Nama Brand / Perusahaan *
              </label>
              <div style={{ position: 'relative' }}>
                <Building2 size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="text"
                  name="brand_name"
                  required
                  placeholder="misal: PT Aetheria Fashion Indonesia"
                  value={formData.brand_name}
                  onChange={handleChange}
                  className="glass-input"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            {/* Contact Person */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Nama PIC / Contact Person *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="text"
                  name="contact_person"
                  required
                  placeholder="misal: Sarah Jenkins"
                  value={formData.contact_person}
                  onChange={handleChange}
                  className="glass-input"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Email Kerja *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="sarah@brand.co.id"
                  value={formData.email}
                  onChange={handleChange}
                  className="glass-input"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Nomor WhatsApp / HP
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="tel"
                  name="phone"
                  placeholder="+62 812 3456 7890"
                  value={formData.phone}
                  onChange={handleChange}
                  className="glass-input"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            {/* Project Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Judul Proyek / Kampanye *
              </label>
              <div style={{ position: 'relative' }}>
                <Briefcase size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="text"
                  name="project_title"
                  required
                  placeholder="misal: Peluncuran Koleksi Terbaru 2026"
                  value={formData.project_title}
                  onChange={handleChange}
                  className="glass-input"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            {/* Project Type */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Jenis Proyek
              </label>
              <select
                name="project_type"
                value={formData.project_type}
                onChange={handleChange}
                className="glass-input"
                style={{ cursor: 'pointer', background: '#FFFFFF', color: '#0F172A' }}
              >
                {projectTypes.map((type, idx) => (
                  <option key={idx} value={type} style={{ background: '#FFFFFF', color: '#0F172A' }}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Date */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Target Tanggal Produksi
              </label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="date"
                  name="target_date"
                  value={formData.target_date}
                  onChange={handleChange}
                  className="glass-input"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Estimasi Anggaran (Rupiah)
              </label>
              <div style={{ position: 'relative' }}>
                <Wallet size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <select
                  name="budget_range"
                  value={formData.budget_range}
                  onChange={handleChange}
                  className="glass-input"
                  style={{ paddingLeft: '38px', cursor: 'pointer', background: '#FFFFFF', color: '#0F172A' }}
                >
                  {budgetRanges.map((range, idx) => (
                    <option key={idx} value={range} style={{ background: '#FFFFFF', color: '#0F172A' }}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Requested Talent Selection (if not fixed) */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
              Pilih Talent Spesifik (Opsional)
            </label>
            <select
              name="talent_id"
              value={formData.talent_id}
              onChange={handleChange}
              className="glass-input"
              style={{ cursor: 'pointer', background: '#FFFFFF', color: '#0F172A' }}
            >
              <option value="" style={{ background: '#FFFFFF', color: '#0F172A' }}>
                -- Pengajuan Umum / Rekomendasi Agency --
              </option>
              {allTalents.map((t) => (
                <option key={t.id} value={t.id} style={{ background: '#FFFFFF', color: '#0F172A' }}>
                  {t.name} ({t.category} - {t.title})
                </option>
              ))}
            </select>
          </div>

          {/* Project Brief & Notes */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
              Brief Kampanye & Catatan Khusus
            </label>
            <div style={{ position: 'relative' }}>
              <textarea
                name="notes"
                rows={3}
                placeholder="Tuliskan detail deliverables, konsep moodboard, lokasi syuting, kanal distribusi media, atau tanggal tayang..."
                value={formData.notes}
                onChange={handleChange}
                className="glass-input"
                style={{ resize: 'vertical', minHeight: '80px' }}
              />
            </div>
          </div>

          {/* Submit Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px',
              borderTop: '1px solid var(--color-border-medium)',
              paddingTop: '20px'
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="btn btn-secondary"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ minWidth: '180px' }}
            >
              {submitting ? (
                <>
                  <span className="animate-pulse-glow">Mengirim...</span>
                </>
              ) : (
                <>
                  <Send size={16} /> Kirim Brief Booking
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
