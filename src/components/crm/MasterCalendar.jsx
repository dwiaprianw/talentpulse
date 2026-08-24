import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  X,
  Users,
  Clock,
  Briefcase
} from 'lucide-react';
import { deleteSchedule } from '../../services/api';
import AddScheduleModal from './AddScheduleModal';

export default function MasterCalendar({
  schedules = [],
  talents = [],
  projects = [],
  onScheduleCreated = () => {},
  onScheduleDeleted = () => {},
  addToast = () => {}
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTalentFilter, setSelectedTalentFilter] = useState('All');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedDateForNewEvent, setSelectedDateForNewEvent] = useState('');
  const [activeEventDetail, setActiveEventDetail] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const todayMonth = () => {
    setCurrentDate(new Date());
  };

  // Month metadata
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('en-US', { month: 'long' });

  // First day of current month (0 = Sun, 1 = Mon...)
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Total days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Total days in previous month
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Generate calendar days grid (42 cells matrix)
  const calendarDays = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevDate = new Date(year, month - 1, dayNum);
    const dateKey = prevDate.toISOString().split('T')[0];
    calendarDays.push({ dayNum, isCurrentMonth: false, dateKey });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    const dateKey = `${year}-${mStr}-${dStr}`;
    calendarDays.push({ dayNum: d, isCurrentMonth: true, dateKey });
  }

  // Next month leading days to complete matrix
  const remainingCells = 42 - calendarDays.length;
  for (let j = 1; j <= remainingCells; j++) {
    const nextDate = new Date(year, month + 1, j);
    const dateKey = nextDate.toISOString().split('T')[0];
    calendarDays.push({ dayNum: j, isCurrentMonth: false, dateKey });
  }

  // Filter schedules
  const filteredSchedules = schedules.filter((item) => {
    const matchesTalent =
      selectedTalentFilter === 'All' || String(item.talent_id) === String(selectedTalentFilter);

    const typeStr = (item.event_type || '').toLowerCase();
    const matchesType =
      selectedTypeFilter === 'All' ||
      (selectedTypeFilter === 'shooting' && typeStr.includes('shoot')) ||
      (selectedTypeFilter === 'content_post' && (typeStr.includes('post') || typeStr.includes('publish'))) ||
      (selectedTypeFilter === 'fitting' && (typeStr.includes('fitting') || typeStr.includes('meeting'))) ||
      (selectedTypeFilter === 'payment' && (typeStr.includes('payment') || typeStr.includes('invoice')));

    return matchesTalent && matchesType;
  });

  // Group schedules by YYYY-MM-DD date key
  const schedulesByDate = {};
  filteredSchedules.forEach((item) => {
    const key = item.event_date;
    if (!schedulesByDate[key]) schedulesByDate[key] = [];
    schedulesByDate[key].push(item);
  });

  const todayKey = new Date().toISOString().split('T')[0];

  const handleDayClick = (day) => {
    setSelectedDateForNewEvent(day.dateKey);
    setAddModalOpen(true);
  };

  const handleDeleteSchedule = async (id, e) => {
    e.stopPropagation();
    try {
      setDeletingId(id);
      await deleteSchedule(id);
      onScheduleDeleted(id);
      setActiveEventDetail(null);
      addToast({
        type: 'info',
        title: 'Event Deleted',
        message: 'The schedule event was removed from the calendar.'
      });
    } catch (err) {
      console.error('Error deleting schedule:', err);
      addToast({
        type: 'error',
        title: 'Deletion Failed',
        message: err.message || 'Could not delete schedule event.'
      });
    } finally {
      setDeletingId(null);
    }
  };

  const getEventBadgeMeta = (eventType = '') => {
    const t = eventType.toLowerCase();
    if (t.includes('shoot')) {
      return {
        badgeClass: 'event-badge-shooting',
        label: 'Shooting Session',
        emoji: '🟣',
        bg: '#F3E8FF',
        color: '#6B21A8',
        border: '#D8B4FE'
      };
    }
    if (t.includes('post') || t.includes('publish')) {
      return {
        badgeClass: 'event-badge-posting',
        label: 'Content Publish',
        emoji: '🔵',
        bg: '#DBEAFE',
        color: '#1E40AF',
        border: '#93C5FD'
      };
    }
    if (t.includes('fitting') || t.includes('meeting')) {
      return {
        badgeClass: 'event-badge-fitting',
        label: 'Fitting & Alignment',
        emoji: '🟠',
        bg: '#FEF3C7',
        color: '#92400E',
        border: '#FDE68A'
      };
    }
    return {
      badgeClass: 'event-badge-payment',
      label: 'Payment Milestone',
      emoji: '🔴',
      bg: '#FFE4E6',
      color: '#9F1239',
      border: '#FECDD3'
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Calendar Control Toolbar */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          background: '#FFFFFF',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--color-border-medium)'
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#D97706',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '4px'
            }}
          >
            <CalendarIcon size={15} /> Production Master Calendar
          </div>
          <h2 className="font-heading" style={{ fontSize: '1.6rem', color: 'var(--color-text-primary)' }}>
            Agency <span className="text-gradient-amber-rose">Schedule & Milestones</span>
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.86rem' }}>
            Color-coded scheduling for talent shoots, content publishing, fittings, and invoice deadlines.
          </p>
        </div>

        {/* Month Navigation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              type="button"
              onClick={prevMonth}
              className="btn-icon"
              title="Previous Month"
              style={{ width: '36px', height: '36px' }}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={todayMonth}
              className="btn btn-secondary btn-sm"
              style={{ padding: '6px 14px' }}
            >
              Today
            </button>

            <button
              type="button"
              onClick={nextMonth}
              className="btn-icon"
              title="Next Month"
              style={{ width: '36px', height: '36px' }}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <h3
            className="font-heading"
            style={{
              fontSize: '1.25rem',
              minWidth: '160px',
              textAlign: 'center',
              fontWeight: 800,
              color: 'var(--color-text-primary)'
            }}
          >
            {monthName} {year}
          </h3>

          <button
            type="button"
            onClick={() => {
              setSelectedDateForNewEvent(todayKey);
              setAddModalOpen(true);
            }}
            className="btn btn-primary"
            style={{ gap: '6px', height: '38px' }}
          >
            <Plus size={16} /> Add Event
          </button>
        </div>

        {/* Filters: Talent & Event Types */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Talent Selector */}
          <select
            value={selectedTalentFilter}
            onChange={(e) => setSelectedTalentFilter(e.target.value)}
            className="glass-input"
            style={{ width: '180px', fontSize: '0.84rem', background: '#FFFFFF', color: '#0F172A', height: '38px' }}
          >
            <option value="All" style={{ background: '#FFFFFF', color: '#0F172A' }}>All Talents</option>
            {talents.map((t) => (
              <option key={t.id} value={t.id} style={{ background: '#FFFFFF', color: '#0F172A' }}>
                {t.name} ({t.category})
              </option>
            ))}
          </select>

          {/* Event Type Filter */}
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="glass-input"
            style={{ width: '170px', fontSize: '0.84rem', background: '#FFFFFF', color: '#0F172A', height: '38px' }}
          >
            <option value="All" style={{ background: '#FFFFFF', color: '#0F172A' }}>All Event Types</option>
            <option value="shooting" style={{ background: '#FFFFFF', color: '#0F172A' }}>🟣 Shooting Sessions</option>
            <option value="content_post" style={{ background: '#FFFFFF', color: '#0F172A' }}>🔵 Content Posts</option>
            <option value="fitting" style={{ background: '#FFFFFF', color: '#0F172A' }}>🟠 Fittings / Meetings</option>
            <option value="payment" style={{ background: '#FFFFFF', color: '#0F172A' }}>🔴 Payment Milestones</option>
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
        <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>Legend:</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#6B21A8', fontWeight: 600 }}>
          🟣 Shooting / Production
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#1E40AF', fontWeight: 600 }}>
          🔵 Content Post / Publish
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#92400E', fontWeight: 600 }}>
          🟠 Fitting / Meeting
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#9F1239', fontWeight: 600 }}>
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
              background: '#FFFFFF',
              border: '1px solid var(--color-border-medium)',
              boxShadow: 'var(--shadow-xl)'
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
                <h3 className="font-heading" style={{ fontSize: '1.3rem', color: 'var(--color-text-primary)' }}>
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
                <Clock size={16} color="#2563EB" />
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
                  <Briefcase size={16} color="#06B6D4" />
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
                    background: '#F8FAFC',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-medium)',
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
                borderTop: '1px solid var(--color-border-medium)'
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
