/**
 * Talent CRM & Marketing Showcase API Service Layer
 * Wraps REST API endpoints on /api
 */

const BASE_URL = '/api';

/**
 * Custom API Error containing status code and server error details
 */
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Generic request helper with JSON headers, auth role headers, and structured error handling
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  // Automatically attach auth role header & token from localStorage if logged in
  let authHeaders = {};
  try {
    const savedUser = localStorage.getItem('tp_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed && parsed.role) {
        authHeaders['x-user-role'] = parsed.role;
      }
    }
    const token = localStorage.getItem('tp_token');
    if (token) {
      authHeaders['authorization'] = `Bearer ${token}`;
    }
    // Fallback default role header if logged in state is present
    if (!authHeaders['x-user-role']) {
      authHeaders['x-user-role'] = 'admin';
    }
  } catch {
    authHeaders['x-user-role'] = 'admin';
  }

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers
    },
    ...options
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await response.text();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const errorMessage =
      (data && (data.error || data.message)) ||
      `Request failed with status ${response.status} (${response.statusText})`;
    throw new ApiError(errorMessage, response.status, data);
  }

  return data;
}

/* ==========================================================================
   1. DASHBOARD STATS
   ========================================================================== */

/**
 * Fetches dashboard summary metrics (activeTalents, totalTalents, activeProjects, pendingLeads, weekShoots)
 */
export async function fetchStats() {
  return request('/stats');
}

/* ==========================================================================
   2. TALENTS ENDPOINTS
   ========================================================================== */

/**
 * Fetches all talents, optionally filtered by category
 * @param {string} [category] - Optional category filter (e.g. 'Model', 'Content Creator', 'Photographer')
 */
export async function fetchTalents(category) {
  const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
  return request(`/talents${query}`);
}

/**
 * Fetches a single talent by ID
 * @param {number|string} id
 */
export async function getTalent(id) {
  return request(`/talents/${id}`);
}

/**
 * Creates a new talent roster profile
 * @param {Object} talentData
 */
export async function createTalent(talentData) {
  return request('/talents', {
    method: 'POST',
    body: talentData
  });
}

/**
 * Updates an existing talent roster profile
 * @param {number|string} id
 * @param {Object} talentData
 */
export async function updateTalent(id, talentData) {
  return request(`/talents/${id}`, {
    method: 'PUT',
    body: talentData
  });
}

/**
 * Updates a talent's status ('available' | 'booked' | 'unavailable')
 * @param {number|string} id
 * @param {string} status
 */
export async function updateTalentStatus(id, status) {
  return request(`/talents/${id}/status`, {
    method: 'PATCH',
    body: { status }
  });
}

/**
 * Deletes a talent by ID
 * @param {number|string} id
 */
export async function deleteTalent(id) {
  return request(`/talents/${id}`, {
    method: 'DELETE'
  });
}

/* ==========================================================================
   3. PROJECTS & CLIENT BOOKINGS (Kanban Pipeline)
   ========================================================================== */

/**
 * Fetches all projects with joined talent details
 */
export async function fetchProjects() {
  return request('/projects');
}

/**
 * Fetches a single project by ID
 * @param {number|string} id
 */
export async function getProject(id) {
  return request(`/projects/${id}`);
}

/**
 * Creates a new client booking inquiry / project lead
 * @param {Object} inquiryData
 */
export async function createBookingInquiry(inquiryData) {
  return request('/projects', {
    method: 'POST',
    body: inquiryData
  });
}

/**
 * Alias for createBookingInquiry
 */
export async function createProject(projectData) {
  return createBookingInquiry(projectData);
}

/**
 * Updates an existing project
 * @param {number|string} id
 * @param {Object} projectData
 */
export async function updateProject(id, projectData) {
  return request(`/projects/${id}`, {
    method: 'PUT',
    body: projectData
  });
}

/**
 * Updates a project's Kanban pipeline stage ('new_lead' | 'contacted' | 'briefing' | 'production' | 'completed')
 * @param {number|string} id
 * @param {string} stage
 */
export async function updateProjectStage(id, stage) {
  return request(`/projects/${id}/stage`, {
    method: 'PATCH',
    body: { status_stage: stage, stage }
  });
}

/**
 * Deletes a project by ID
 * @param {number|string} id
 */
export async function deleteProject(id) {
  return request(`/projects/${id}`, {
    method: 'DELETE'
  });
}

/* ==========================================================================
   4. SCHEDULES ENDPOINTS (Master Calendar)
   ========================================================================== */

/**
 * Fetches all calendar schedule events with joined talent & project info
 */
export async function fetchSchedules() {
  return request('/schedules');
}

/**
 * Creates a new schedule calendar event
 * @param {Object} scheduleData
 */
export async function createSchedule(scheduleData) {
  return request('/schedules', {
    method: 'POST',
    body: scheduleData
  });
}

/**
 * Deletes a schedule event by ID
 * @param {number|string} id
 */
export async function deleteSchedule(id) {
  return request(`/schedules/${id}`, {
    method: 'DELETE'
  });
}

/* ==========================================================================
   DEFAULT EXPORT
   ========================================================================== */

const api = {
  fetchStats,
  fetchTalents,
  getTalent,
  createTalent,
  updateTalent,
  updateTalentStatus,
  deleteTalent,
  fetchProjects,
  getProject,
  createBookingInquiry,
  createProject,
  updateProject,
  updateProjectStage,
  deleteProject,
  fetchSchedules,
  createSchedule,
  deleteSchedule
};

export default api;
