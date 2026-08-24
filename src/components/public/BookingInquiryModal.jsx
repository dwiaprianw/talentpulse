import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Building2,
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  DollarSign,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { createBookingInquiry } from '../../services/api';

export default function BookingInquiryModal({
  isOpen = false,
  selectedTalent = null,
  allTalents = [],
  onClose = () => {},
  onSuccess = () => {}
}) {
  const [formData, setFormData] = useState({
    brand_name: '',
    contact_person: '',
    email: '',
    phone: '',
    project_title: '',
    project_type: 'Social Campaign & Video Reels',
    target_date: '',
    budget_range: '$5,000 - $10,000',
    talent_id: '',
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Initialize or update talent_id and default title when selectedTalent changes
  useEffect(() => {
    if (selectedTalent) {
      setFormData((prev) => ({
        ...prev,
        talent_id: String(selectedTalent.id),
        project_title: prev.project_title || `${selectedTalent.name} Campaign Collaboration`
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        talent_id: ''
      }));
    }
  }, [selectedTalent, isOpen]);

  // Handle ESC key close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !submitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, submitting, onClose]);

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

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.brand_name.trim()) {
      setError('Please provide your brand or company name.');
      return;
    }
    if (!formData.contact_person.trim()) {
      setError('Please provide the primary contact person.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid work email address.');
      return;
    }
    if (!formData.project_title.trim()) {
      setError('Please specify a project title or campaign theme.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        brand_name: formData.brand_name.trim(),
        contact_person: formData.contact_person.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        project_title: formData.project_title.trim(),
        project_type: formData.project_type,
        target_date: formData.target_date || '',
        budget_range: formData.budget_range,
        status_stage: 'new_lead',
        talent_id: formData.talent_id ? Number(formData.talent_id) : null,
        notes: formData.notes.trim()
      };

      const result = await createBookingInquiry(payload);
      onSuccess(result, formData);
      onClose();
    } catch (err) {
      console.error('Failed to submit booking inquiry:', err);
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const projectTypes = [
    'Social Campaign & Video Reels',
    'Editorial Lookbook & Runway',
    'Studio Product Photography',
    'Commercial Drone Video',
    '3D CGI Brand Package',
    'Brand Ambassadorship',
    'Event Appearance / Keynote',
    'Custom Production Project'
  ];

  const budgetRanges = [
    '< $5,000',
    '$5,000 - $10,000',
    '$10,000 - $20,000',
    '$20,000 - $50,000',
    '$50,000+'
  ];

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div
        className="glass-panel animate-scale-in"
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '92vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '32px',
          background: 'rgba(15, 23, 42, 0.96)',
          border: '1px solid rgba(236, 72, 153, 0.35)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), var(--shadow-glow-pink)'
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          aria-label="Close booking form"
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
            cursor: submitting ? 'not-allowed' : 'pointer',
            transition: 'all var(--transition-fast)',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            if (!submitting) {
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-secondary)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(236, 72, 153, 0.12)',
              border: '1px solid rgba(236, 72, 153, 0.3)',
              color: 'var(--color-accent-pink)',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '10px'
            }}
          >
            <Sparkles size={13} /> Direct Agency Booking Inquiry
          </div>

          <h2
            id="booking-modal-title"
            className="font-heading"
            style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              lineHeight: 1.2
            }}
          >
            Book Talent & <span className="text-gradient-purple-pink">Submit Campaign Brief</span>
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Fill out your project specifications below. Our agency directors will review talent availability and respond with a customized proposal within 24 hours.
          </p>

          {/* If a talent is preselected, display brief highlight card */}
          {selectedTalent && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px 16px',
                background: 'rgba(139, 92, 246, 0.12)',
                border: '1px solid rgba(139, 92, 246, 0.25)',
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
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>
                  Booking: {selectedTalent.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-accent-purple-light)' }}>
                  {selectedTalent.category} &bull; Rate card: {typeof selectedTalent.rate_card === 'string' ? selectedTalent.rate_card : '$3,500 / day'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className="animate-slide-up"
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              color: '#FB7185',
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
                Brand / Client Name *
              </label>
              <div style={{ position: 'relative' }}>
                <Building2 size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="text"
                  name="brand_name"
                  required
                  placeholder="e.g. Acme Luxury Apparel"
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
                Contact Person *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="text"
                  name="contact_person"
                  required
                  placeholder="e.g. Sarah Jenkins"
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
                Work Email *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="s.jenkins@acme.com"
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
                Phone Number
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
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
                Project / Campaign Title *
              </label>
              <div style={{ position: 'relative' }}>
                <Briefcase size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="text"
                  name="project_title"
                  required
                  placeholder="e.g. Autumn Fashion Drop & Lookbook"
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
                Project Type
              </label>
              <select
                name="project_type"
                value={formData.project_type}
                onChange={handleChange}
                className="glass-input"
                style={{ cursor: 'pointer' }}
              >
                {projectTypes.map((type, idx) => (
                  <option key={idx} value={type} style={{ background: '#1E293B', color: '#F8FAFC' }}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Date */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Target Production Date
              </label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="date"
                  name="target_date"
                  value={formData.target_date}
                  onChange={handleChange}
                  className="glass-input"
                  style={{ paddingLeft: '38px', colorScheme: 'dark' }}
                />
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Estimated Budget Range
              </label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <select
                  name="budget_range"
                  value={formData.budget_range}
                  onChange={handleChange}
                  className="glass-input"
                  style={{ paddingLeft: '38px', cursor: 'pointer' }}
                >
                  {budgetRanges.map((range, idx) => (
                    <option key={idx} value={range} style={{ background: '#1E293B', color: '#F8FAFC' }}>
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
              Assign Specific Talent (Optional)
            </label>
            <select
              name="talent_id"
              value={formData.talent_id}
              onChange={handleChange}
              className="glass-input"
              style={{ cursor: 'pointer' }}
            >
              <option value="" style={{ background: '#1E293B', color: '#F8FAFC' }}>
                -- General Inquiry / Agency Recommendation --
              </option>
              {allTalents.map((t) => (
                <option key={t.id} value={t.id} style={{ background: '#1E293B', color: '#F8FAFC' }}>
                  {t.name} ({t.category} - {t.title})
                </option>
              ))}
            </select>
          </div>

          {/* Project Brief & Notes */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
              Campaign Brief & Specific Requirements
            </label>
            <div style={{ position: 'relative' }}>
              <textarea
                name="notes"
                rows={3}
                placeholder="Outline deliverables, moodboard concepts, locations, usage channels, or specific timeline constraints..."
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
              borderTop: '1px solid var(--color-border-subtle)',
              paddingTop: '20px'
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ minWidth: '180px' }}
            >
              {submitting ? (
                <>
                  <span className="animate-pulse-glow">Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={16} /> Submit Inquiry
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
