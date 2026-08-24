import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { createSchedule } from '../../services/api';

export default function AddScheduleModal({
  isOpen = false,
  onClose = () => {},
  projects = [],
  talents = [],
  initialDate = '',
  onSuccess = () => {}
}) {
  const [formData, setFormData] = useState({
    title: '',
    event_type: 'shooting',
    event_date: initialDate || new Date().toISOString().split('T')[0],
    project_id: '',
    talent_id: '',
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjectSelect = (e) => {
    const projectId = e.target.value;
    const proj = projects.find((p) => String(p.id) === String(projectId));
    setFormData((prev) => ({
      ...prev,
      project_id: projectId,
      talent_id: proj && proj.talent_id ? proj.talent_id : prev.talent_id,
      title: proj ? `${proj.brand_name} - Shoot Session` : prev.title
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.event_date) {
      setError('Event title and scheduled date are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        title: formData.title.trim(),
        event_type: formData.event_type,
        event_date: formData.event_date,
        project_id: formData.project_id || null,
        talent_id: formData.talent_id || (talents.length > 0 ? talents[0].id : null),
        notes: formData.notes.trim()
      };

      const created = await createSchedule(payload);
      onSuccess(created);
      onClose();
    } catch (err) {
      console.error('Error adding schedule event:', err);
      setError(err.message || 'Failed to record schedule event.');
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
          maxWidth: '600px',
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
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
              <CalendarIcon size={22} />
            </div>
            <div>
              <h2 className="font-heading" style={{ fontSize: '1.35rem', color: 'var(--color-text-primary)' }}>
                Add Schedule Event
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem' }}>
                Record production shoots, content posts, meetings, or deadlines
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
              Event Title / Description *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Acme Apparel Fall Campaign Shoot"
              required
              className="glass-input"
            />
          </div>

          {/* Event Type & Date */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Event Category / Type
              </label>
              <select
                name="event_type"
                value={formData.event_type}
                onChange={handleChange}
                className="glass-input"
                style={{ background: '#FFFFFF', color: '#0F172A' }}
              >
                <option value="shooting">🟣 Shooting / Production Session</option>
                <option value="content_post">🔵 Content Post / Social Publish</option>
                <option value="fitting">🟠 Fitting & Wardrobe Styling</option>
                <option value="meeting">🟠 Client Alignment / Zoom Meeting</option>
                <option value="payment">🔴 Payment Milestone / Invoice Disbursal</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Scheduled Date *
              </label>
              <input
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
                required
                className="glass-input"
              />
            </div>
          </div>

          {/* Project & Talent Links */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Linked Project / Client (Optional)
              </label>
              <select
                name="project_id"
                value={formData.project_id}
                onChange={handleProjectSelect}
                className="glass-input"
                style={{ background: '#FFFFFF', color: '#0F172A' }}
              >
                <option value="">-- No Project Linked --</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.brand_name} - {p.project_title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Assigned Talent (Optional)
              </label>
              <select
                name="talent_id"
                value={formData.talent_id}
                onChange={handleChange}
                className="glass-input"
                style={{ background: '#FFFFFF', color: '#0F172A' }}
              >
                <option value="">-- No Talent Assigned --</option>
                {talents.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
              Logistics & Call Sheet Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="e.g. Call time 06:00 AM, Studio B lighting setup, wardrobe stylist on site..."
              className="glass-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Footer Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '8px',
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
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ minWidth: '140px' }}
            >
              {submitting ? 'Scheduling...' : 'Save Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
