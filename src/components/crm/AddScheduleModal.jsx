import React, { useState } from 'react';
import { X, Calendar, Camera, Send, Users, Briefcase, FileText, Check } from 'lucide-react';
import { createSchedule } from '../../services/api';

export default function AddScheduleModal({
  isOpen = false,
  talents = [],
  projects = [],
  initialDate = '',
  onClose = () => {},
  onSuccess = () => {}
}) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    event_type: 'shooting',
    event_date: initialDate || todayStr,
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
    const projId = e.target.value;
    const selectedProj = projects.find((p) => String(p.id) === String(projId));
    setFormData((prev) => ({
      ...prev,
      project_id: projId,
      // Auto-fill talent if project has assigned talent
      talent_id: selectedProj?.talent_id ? String(selectedProj.talent_id) : prev.talent_id
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Event title is required.');
      return;
    }
    if (!formData.event_date) {
      setError('Event date is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        title: formData.title.trim(),
        event_type: formData.event_type,
        event_date: formData.event_date,
        project_id: formData.project_id ? Number(formData.project_id) : null,
        talent_id: formData.talent_id ? Number(formData.talent_id) : null,
        notes: formData.notes.trim()
      };

      const created = await createSchedule(payload);
      onSuccess(created);
      onClose();
    } catch (err) {
      console.error('Error creating schedule:', err);
      setError(err.message || 'Failed to add calendar schedule event');
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
          maxWidth: '580px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          boxShadow: 'var(--shadow-glass), 0 0 25px rgba(245, 158, 11, 0.25)'
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
                background: 'linear-gradient(135deg, var(--color-accent-amber) 0%, var(--color-accent-rose) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}
            >
              <Calendar size={22} />
            </div>
            <div>
              <h2 className="font-heading" style={{ fontSize: '1.4rem' }}>
                Add Schedule Event
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem' }}>
                Schedule production shoots, fittings, posts, or meetings
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
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#FECDD3',
              fontSize: '0.88rem',
              marginBottom: '20px'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
              Event Title / Activity Name *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Aetheria - Paris Runway Outdoor Shoot"
              required
              className="glass-input"
            />
          </div>

          {/* Event Type & Date */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Event Type Category *
              </label>
              <select
                name="event_type"
                value={formData.event_type}
                onChange={handleChange}
                className="glass-input"
                style={{ background: 'rgba(15, 23, 42, 0.9)' }}
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
                style={{ colorScheme: 'dark' }}
              >
              </input>
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
                style={{ background: 'rgba(15, 23, 42, 0.9)' }}
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
                style={{ background: 'rgba(15, 23, 42, 0.9)' }}
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
              borderTop: '1px solid var(--color-border-subtle)'
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
