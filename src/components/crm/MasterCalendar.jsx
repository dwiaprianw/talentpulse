import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Users,
  Camera,
  Send,
  Clock,
  Trash2,
  X,
  Sparkles,
  DollarSign,
  AlertCircle,
  MapPin,
  User,
  CheckCircle2
} from 'lucide-react';
import { deleteSchedule } from '../../services/api';
import AddScheduleModal from './AddScheduleModal';

// Event Type Metadata & Badge Config
const EVENT_TYPES = {
  shooting: {
    label: 'Shooting / Production',
    badgeClass: 'event-badge-shooting',
    emoji: '🟣',
    color: '#DDD6FE',
    bg: 'rgba(139, 92, 246, 0.25)',
    border: 'rgba(139, 92, 246, 0.5)'
  },
  content_post: {
    label: 'Content Post / Publish',
    badgeClass: 'event-badge-posting',
    emoji: '🔵',
    color: '#BFDBFE',
    bg: 'rgba(59, 130, 246, 0.25)',
    border: 'rgba(59, 130, 246, 0.5)'
  },
  fitting: {
    label: 'Fitting / Wardrobe',
    badgeClass: 'event-badge-fitting',
    emoji: '🟠',
    color: '#FDE68A',
    bg: 'rgba(245, 158, 11, 0.25)',
    border: 'rgba(245, 158, 11, 0.5)'
  },
  meeting: {
    label: 'Meeting / Alignment',
    badgeClass: 'event-badge-fitting',
    emoji: '🟠',
    color: '#FDE68A',
    bg: 'rgba(245, 158, 11, 0.25)',
    border: 'rgba(245, 158, 11, 0.5)'
  },
  payment: {
    label: 'Payment / Invoice',
    badgeClass: 'event-badge-payment',
    emoji: '🔴',
    color: '#FECDD3',
    bg: 'rgba(244, 63, 94, 0.25)',
    border: 'rgba(244, 63, 94, 0.5)'
  }
};

export default function MasterCalendar({
  schedules = [],
  talents = [],
  projects = [],
  onScheduleCreated = () => {},
  onScheduleDeleted = () => {},
  addToast = () => {}
}) {
  // Calendar View Month State (default to current date)
  const [currentDate, setCurrentDate] = useState(() => {
    // Check if we have schedules, default to August 2026 if seeded data is in 2026, or current real date
    return new Date(2026, 7, 1); // August 2026 (Month is 0-indexed: 7 = August)
  });

  const [selectedTalentFilter, setSelectedTalentFilter] = useState('All');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedDateForNewEvent, setSelectedDateForNewEvent] = useState('');
  const [activeEventDetail, setActiveEventDetail] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Month navigation helpers
  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleJumpToToday = () => {
    setCurrentDate(new Date(2026, 7, 24)); // August 24, 2026 current baseline
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper to format Date to YYYY-MM-DD
  const formatDateKey = (year, month, day) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  // Filter schedules based on talent & event type
  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      // Talent filter
      if (selectedTalentFilter !== 'All') {
        if (String(s.talent_id) !== String(selectedTalentFilter)) {
          return false;
        }
      }

      // Event Type filter
      if (selectedTypeFilter !== 'All') {
        const type = (s.event_type || '').toLowerCase();
        if (selectedTypeFilter === 'shooting' && !type.includes('shoot')) return false;
        if (selectedTypeFilter === 'content_post' && !type.includes('post') && !type.includes('publish')) return false;
        if (selectedTypeFilter === 'fitting' && !type.includes('fit') && !type.includes('meet')) return false;
        if (selectedTypeFilter === 'payment' && !type.includes('pay') && !type.includes('invoice')) return false;
      }

      return true;
    });
  }, [schedules, selectedTalentFilter, selectedTypeFilter]);

  // Build Calendar Matrix
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun, 1 = Mon ...
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Preceding padding days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevMonthIdx = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateKey = formatDateKey(prevYear, prevMonthIdx, dayNum);
      days.push({
        dayNum,
        dateKey,
        isCurrentMonth: false
      });
    }

    // Days in current month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateKey = formatDateKey(currentYear, currentMonth, i);
      days.push({
        dayNum: i,
        dateKey,
        isCurrentMonth: true
      });
    }

    // Trailing padding days to fill 35 or 42 grid cells (complete weeks)
    const totalCells = Math.ceil(days.length / 7) * 7;
    const remaining = totalCells - days.length;
    for (let i = 1; i <= remaining; i++) {
      const nextMonthIdx = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateKey = formatDateKey(nextYear, nextMonthIdx, i);
      days.push({
        dayNum: i,
        dateKey,
        isCurrentMonth: false
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Group filtered schedules by date key
  const schedulesByDate = useMemo(() => {
    const map = {};
    filteredSchedules.forEach((item) => {
      const dateKey = item.event_date ? item.event_date.split('T')[0] : '';
      if (dateKey) {
        if (!map[dateKey]) map[dateKey] = [];
        map[dateKey].push(item);
      }
    });
    return map;
  }, [filteredSchedules]);

  // Handle Event deletion
  const handleDeleteSchedule = async (scheduleId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to remove this schedule event?')) return;

    try {
      setDeletingId(scheduleId);
      await deleteSchedule(scheduleId);
      onScheduleDeleted(scheduleId);
      setActiveEventDetail(null);
      addToast({
        type: 'success',
        title: 'Schedule Removed',
        message: 'Event was successfully removed from the calendar.'
      });
    } catch (err) {
      console.error('Failed to delete schedule:', err);
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.message || 'Could not remove schedule event'
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Helper to determine event badge styling
  const getEventBadgeMeta = (eventType) => {
    const type = (eventType || '').toLowerCase();
    if (type.includes('shoot')) return EVENT_TYPES.shooting;
    if (type.includes('post') || type.includes('publish')) return EVENT_TYPES.content_post;
    if (type.includes('fit') || type.includes('wardrobe')) return EVENT_TYPES.fitting;
    if (type.includes('meet')) return EVENT_TYPES.meeting;
    if (type.includes('pay') || type.includes('invoice')) return EVENT_TYPES.payment;
    return EVENT_TYPES.shooting;
  };

  const handleDayClick = (day) => {
    setSelectedDateForNewEvent(day.dateKey);
    setAddModalOpen(true);
  };

  const todayKey = '2026-08-24'; // Sync with system timestamp context

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header & Calendar Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h2 className="font-heading" style={{ fontSize: '1.6rem', marginBottom: '4px' }}>
            Agency Master Production Calendar
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem' }}>
            Synchronize shoot call times, social post deliveries, fittings, and talent payment milestones.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedDateForNewEvent(formatDateKey(currentYear, currentMonth, new Date().getDate()));
            setAddModalOpen(true);
          }}
          className="btn btn-primary"
          style={{ gap: '6px' }}
        >
          <Plus size={16} /> Add Schedule Event
        </button>
      </div>

      {/* Month Navigation & Legend Bar */}
      <div
        className="glass-card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        {/* Month Selector Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              type="button"
              onClick={handlePrevMonth}
              className="btn-icon"
              title="Previous Month"
              style={{ padding: '8px' }}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={handleNextMonth}
              className="btn-icon"
              title="Next Month"
              style={{ padding: '8px' }}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, minWidth: '190px' }}>
            {monthNames[currentMonth]} {currentYear}
          </h3>

          <button
            type="button"
            onClick={handleJumpToToday}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.8rem', padding: '4px 10px' }}
          >
            Today
          </button>
        </div>

        {/* Filters: Talent & Event Types */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Talent Selector */}
          <select
            value={selectedTalentFilter}
            onChange={(e) => setSelectedTalentFilter(e.target.value)}
            className="glass-input"
            style={{ width: '180px', fontSize: '0.84rem', background: 'rgba(15, 23, 42, 0.9)' }}
          >
            <option value="All">All Talents</option>
            {talents.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.category})
              </option>
            ))}
          </select>

          {/* Event Type Filter */}
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="glass-input"
            style={{ width: '170px', fontSize: '0.84rem', background: 'rgba(15, 23, 42, 0.9)' }}
          >
            <option value="All">All Event Types</option>
            <option value="shooting">🟣 Shooting Sessions</option>
            <option value="content_post">🔵 Content Posts</option>
            <option value="fitting">🟠 Fittings / Meetings</option>
            <option value="payment">🔴 Payment Milestones</option>
          </select>
        </div>
      </div>

      {/* Color Legend Badges */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '0 8px',
          flexWrap: 'wrap',
          fontSize: '0.8rem',
          color: 'var(--color-text-secondary)'
        }}
      >
        <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Legend:</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#DDD6FE' }}>
          🟣 Shooting / Production
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#BFDBFE' }}>
          🔵 Content Post / Publish
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#FDE68A' }}>
          🟠 Fitting / Meeting
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#FECDD3' }}>
          🔴 Payment / Invoice
        </span>
      </div>

      {/* Visual Monthly Calendar Grid */}
      <div style={{ overflowX: 'auto' }}>
        <table className="calendar-matrix" style={{ minWidth: '780px' }}>
          <thead>
            <tr>
              <th className="calendar-header-cell">Sun</th>
              <th className="calendar-header-cell">Mon</th>
              <th className="calendar-header-cell">Tue</th>
              <th className="calendar-header-cell">Wed</th>
              <th className="calendar-header-cell">Thu</th>
              <th className="calendar-header-cell">Fri</th>
              <th className="calendar-header-cell">Sat</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, weekIdx) => {
              const weekDays = calendarDays.slice(weekIdx * 7, (weekIdx + 1) * 7);
              return (
                <tr key={weekIdx}>
                  {weekDays.map((day) => {
                    const isToday = day.dateKey === todayKey;
                    const dayEvents = schedulesByDate[day.dateKey] || [];

                    return (
                      <td
                        key={day.dateKey}
                        className={`calendar-cell ${!day.isCurrentMonth ? 'calendar-cell-other-month' : ''} ${isToday ? 'calendar-cell-today' : ''}`}
                        onClick={() => handleDayClick(day)}
                        style={{ cursor: 'pointer' }}
                        title={`Click to add event on ${day.dateKey}`}
                      >
                        {/* Day Number Header */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '6px'
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.8rem',
                              fontWeight: isToday ? 800 : 600,
                              color: isToday
                                ? '#FFFFFF'
                                : day.isCurrentMonth
                                ? 'var(--color-text-primary)'
                                : 'var(--color-text-muted)',
                              width: isToday ? '24px' : 'auto',
                              height: isToday ? '24px' : 'auto',
                              borderRadius: isToday ? '50%' : 'none',
                              background: isToday ? 'var(--color-accent-purple)' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {day.dayNum}
                          </span>

                          {dayEvents.length > 0 && (
                            <span
                              style={{
                                fontSize: '0.68rem',
                                color: 'var(--color-text-muted)',
                                fontWeight: 700
                              }}
                            >
                              {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>

                        {/* Event Badges */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxHeight: '82px', overflowY: 'hidden' }}>
                          {dayEvents.slice(0, 3).map((event) => {
                            const meta = getEventBadgeMeta(event.event_type);
                            return (
                              <div
                                key={event.id}
                                className={`event-badge ${meta.badgeClass}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveEventDetail(event);
                                }}
                                title={`${event.title} - ${meta.label}`}
                              >
                                {meta.emoji} {event.title}
                              </div>
                            );
                          })}

                          {dayEvents.length > 3 && (
                            <div
                              style={{
                                fontSize: '0.68rem',
                                color: 'var(--color-accent-purple-light)',
                                fontWeight: 700,
                                paddingLeft: '4px'
                              }}
                            >
                              +{dayEvents.length - 3} more...
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Schedule Modal */}
      <AddScheduleModal
        isOpen={addModalOpen}
        initialDate={selectedDateForNewEvent}
        talents={talents}
        projects={projects}
        onClose={() => setAddModalOpen(false)}
        onSuccess={(newSchedule) => {
          onScheduleCreated(newSchedule);
          addToast({
            type: 'success',
            title: 'Schedule Event Created',
            message: `"${newSchedule.title}" added to the production calendar.`
          });
        }}
      />

      {/* Event Details Preview Modal */}
      {activeEventDetail && (
        <div className="modal-overlay" onClick={() => setActiveEventDetail(null)}>
          <div
            className="glass-panel animate-scale-in"
            style={{
              width: '100%',
              maxWidth: '520px',
              padding: '28px',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              boxShadow: 'var(--shadow-glass), var(--shadow-glow-purple)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                    background: getEventBadgeMeta(activeEventDetail.event_type).bg,
                    color: getEventBadgeMeta(activeEventDetail.event_type).color,
                    border: `1px solid ${getEventBadgeMeta(activeEventDetail.event_type).border}`
                  }}
                >
                  {getEventBadgeMeta(activeEventDetail.event_type).label}
                </span>
                <h3 className="font-heading" style={{ fontSize: '1.3rem' }}>
                  {activeEventDetail.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveEventDetail(null)}
                className="btn-icon"
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
              {/* Date */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="var(--color-accent-blue-light)" />
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  Date: {activeEventDetail.event_date}
                </span>
              </div>

              {/* Talent */}
              {activeEventDetail.talent_name && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={16} color="var(--color-accent-purple-light)" />
                  <span>
                    Talent: <strong style={{ color: 'var(--color-accent-purple-light)' }}>{activeEventDetail.talent_name}</strong>
                  </span>
                </div>
              )}

              {/* Project */}
              {activeEventDetail.brand_name && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Briefcase size={16} color="var(--color-accent-cyan)" />
                  <span>
                    Brand / Project: <strong style={{ color: 'var(--color-text-primary)' }}>{activeEventDetail.brand_name}</strong> ({activeEventDetail.project_title})
                  </span>
                </div>
              )}

              {/* Notes */}
              {activeEventDetail.notes && (
                <div
                  style={{
                    marginTop: '6px',
                    padding: '12px 14px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-subtle)',
                    fontSize: '0.82rem',
                    lineHeight: 1.5
                  }}
                >
                  <strong style={{ display: 'block', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                    Call Sheet & Production Notes:
                  </strong>
                  {activeEventDetail.notes}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '24px',
                paddingTop: '16px',
                borderTop: '1px solid var(--color-border-subtle)'
              }}
            >
              <button
                type="button"
                onClick={(e) => handleDeleteSchedule(activeEventDetail.id, e)}
                disabled={deletingId === activeEventDetail.id}
                className="btn btn-secondary"
                style={{
                  color: 'var(--color-accent-rose)',
                  borderColor: 'rgba(244, 63, 94, 0.3)',
                  padding: '6px 12px',
                  fontSize: '0.82rem',
                  gap: '6px'
                }}
              >
                <Trash2 size={14} /> {deletingId === activeEventDetail.id ? 'Removing...' : 'Delete Event'}
              </button>

              <button
                type="button"
                onClick={() => setActiveEventDetail(null)}
                className="btn btn-primary btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
