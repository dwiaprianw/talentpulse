# Talent CRM Dashboard & Marketing Profile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack Talent Management CRM and Public Marketing Showcase application with a Vite + React frontend (Vibrant Creative Studio aesthetic) and a Node.js Express + SQLite backend.

**Architecture:** A dual-view web application with a Public Marketing Showcase (catalogs, talent profile modals, booking inquiry forms) and an Internal Agency CRM (KPI overview, Talent Roster manager, 5-stage Project Kanban Pipeline, and Master Schedule Calendar). Powered by Express REST endpoints querying a local SQLite file database (`backend/database/crm_talent.db`).

**Tech Stack:** Node.js, Express.js, SQLite (`sqlite3` / `better-sqlite3`), Vite, React 18, Lucide React icons, Vanilla CSS Modules / Global Design System.

**Spec:** [`docs/superpowers/specs/2026-08-24-talent-crm-dashboard-design.md`](file:///Users/dodo/Documents/CRM%20dashboard/docs/superpowers/specs/2026-08-24-talent-crm-dashboard-design.md)

## Global Constraints

- OS: macOS / POSIX shell commands.
- Backend Port: `5001`.
- Frontend Port: `5173`.
- Database File: `backend/database/crm_talent.db`.
- Design Theme: Vibrant Creative Studio (Gradient Meshes, Glassmorphic blurs, Google Fonts `Plus Jakarta Sans` & `Outfit`).

---

### Task 1: Backend Express Server & SQLite Database Setup

**Files:**
- Create: `package.json`
- Create: `backend/server.js`
- Create: `backend/db.js`
- Create: `backend/seed.js`

**Interfaces:**
- Produces: `backend/database/crm_talent.db` initialized with `talents`, `projects`, and `schedules` tables and seeded initial dataset.

- [ ] **Step 1: Create root package.json and install backend dependencies**

```json
{
  "name": "crm-talent-dashboard",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "server": "node backend/server.js",
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "client": "vite"
  }
}
```

Run: `npm install express cors sqlite3 dotenv lucide-react react react-dom`

- [ ] **Step 2: Create SQLite Database Connection & Table Schema (`backend/db.js`)**

Write `backend/db.js` using `sqlite3` driver to create `backend/database/crm_talent.db` with tables:
- `talents` (`id`, `name`, `title`, `category`, `avatar_url`, `bio`, `niche_tags`, `followers`, `engagement_rate`, `internal_fee`, `rate_card`, `status`, `created_at`)
- `projects` (`id`, `brand_name`, `contact_person`, `email`, `phone`, `project_title`, `project_type`, `target_date`, `budget_range`, `status_stage`, `talent_id`, `notes`, `created_at`)
- `schedules` (`id`, `project_id`, `talent_id`, `title`, `event_type`, `event_date`, `notes`, `created_at`)

- [ ] **Step 3: Create Seed Data Script (`backend/seed.js`)**

Write `backend/seed.js` to insert 5+ realistic talents (Influencer, Model, Photographer, Videographer, Designer), 6+ Kanban projects across different stages, and 8+ calendar schedule events.

- [ ] **Step 4: Verify Database Initialization**

Run: `node backend/seed.js`
Expected: SQLite database created at `backend/database/crm_talent.db` with populated seed records.

---

### Task 2: Backend REST API Endpoints

**Files:**
- Modify: `backend/server.js`
- Test: Test via curl or fetch script

**Interfaces:**
- Consumes: SQLite DB tables from `backend/db.js`
- Produces: REST Endpoints `/api/stats`, `/api/talents`, `/api/projects`, `/api/schedules`

- [ ] **Step 1: Implement Express REST API Endpoints in `backend/server.js`**

Implement the following routes:
- `GET /api/stats` -> returns `{ activeTalents, activeProjects, pendingLeads, weekShoots }`
- `GET /api/talents` -> returns array of talents
- `POST /api/talents` -> inserts new talent into `talents` table
- `PUT /api/talents/:id` -> updates talent info
- `PATCH /api/talents/:id/status` -> updates status (`available`, `on_shoot`, `unavailable`)
- `GET /api/projects` -> returns array of projects
- `POST /api/projects` -> inserts client booking inquiry (default stage `new_lead`)
- `PATCH /api/projects/:id/stage` -> updates project `status_stage`
- `GET /api/schedules` -> returns array of schedule events
- `POST /api/schedules` -> inserts new schedule event
- `DELETE /api/schedules/:id` -> deletes event

- [ ] **Step 2: Test API Endpoints with Curl**

Run: `node backend/server.js` in background or test script, then run:
`curl http://localhost:5001/api/stats`
`curl http://localhost:5001/api/talents`
Expected: JSON response with status 200 OK and populated database arrays.

---

### Task 3: Frontend Vite React Scaffolding & Design System Setup

**Files:**
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/index.css`
- Create: `src/App.jsx`
- Create: `src/main.jsx`
- Create: `src/services/api.js`

**Interfaces:**
- Consumes: REST Endpoints on `http://localhost:5001/api`
- Produces: React application with Vibrant Creative Studio design tokens (CSS variables, Google fonts `Plus Jakarta Sans` & `Outfit`, glassmorphic cards).

- [ ] **Step 1: Setup `vite.config.js` with proxy to backend port `5001`**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5001'
    }
  }
});
```

- [ ] **Step 2: Create `src/index.css` with Design System Tokens**

Define CSS variables for Vibrant Creative Studio aesthetic:
- `--color-bg-slate`: `#0F172A`
- `--color-accent-purple`: `#8B5CF6`
- `--color-accent-pink`: `#EC4899`
- `--color-accent-blue`: `#3B82F6`
- `--color-accent-emerald`: `#10B981`
- `--color-accent-amber`: `#F59E0B`
- Glassmorphic card styling `.glass-card`, gradient text `.text-gradient-vibrant`, custom scrollbars, and keyframe animations (`fadeIn`, `pulseGlow`, `slideUp`).

- [ ] **Step 3: Create API Service Abstraction Layer (`src/services/api.js`)**

Methods:
- `fetchStats()`
- `fetchTalents()`
- `createTalent(data)`
- `updateTalentStatus(id, status)`
- `fetchProjects()`
- `createBookingInquiry(data)`
- `updateProjectStage(id, stage)`
- `fetchSchedules()`
- `createSchedule(data)`
- `deleteSchedule(id)`

---

### Task 4: Public Marketing Showcase & Client Booking Flow

**Files:**
- Create: `src/components/common/Navbar.jsx`
- Create: `src/components/common/Toast.jsx`
- Create: `src/components/public/HeroBanner.jsx`
- Create: `src/components/public/TalentCatalog.jsx`
- Create: `src/components/public/TalentCard.jsx`
- Create: `src/components/public/TalentDetailModal.jsx`
- Create: `src/components/public/BookingInquiryModal.jsx`

**Interfaces:**
- Consumes: `api.fetchTalents()`, `api.createBookingInquiry()`
- Produces: Interactive public marketing catalog, talent profile modal, rate card preview, and booking inquiry submission.

- [ ] **Step 1: Build `Navbar.jsx` with View Switcher**

Includes Agency branding, search quick trigger, and a dynamic toggle button to switch between `Public Marketing` and `Agency CRM Portal`.

- [ ] **Step 2: Build `HeroBanner.jsx`**

Vibrant header banner with agency tagline, key highlights (e.g. 50+ Top Talents, 200+ Campaigns), and CTA button.

- [ ] **Step 3: Build `TalentCatalog.jsx` & `TalentCard.jsx`**

Interactive catalog featuring category pills (*All, Influencer, Model, Creative*), keyword search, and animated talent cards displaying photos, engagement metrics/followers, and rates.

- [ ] **Step 4: Build `TalentDetailModal.jsx` & `BookingInquiryModal.jsx`**

- `TalentDetailModal`: Displays full bio, niche tags, photo gallery, package rate cards, and "Book Talent" CTA.
- `BookingInquiryModal`: Form capturing Brand Name, Contact Email, Project Type, Budget Range, Target Dates, and Brief. On submit, calls `api.createBookingInquiry()` and displays success toast notification.

---

### Task 5: Agency CRM Portal (Roster, Kanban, Calendar)

**Files:**
- Create: `src/components/crm/CRMOverview.jsx`
- Create: `src/components/crm/TalentRoster.jsx`
- Create: `src/components/crm/KanbanPipeline.jsx`
- Create: `src/components/crm/MasterCalendar.jsx`
- Create: `src/components/crm/AddTalentModal.jsx`

**Interfaces:**
- Consumes: REST APIs for talents, projects, schedules, and stats.
- Produces: Full agency operations dashboard.

- [ ] **Step 1: Build `CRMOverview.jsx` KPI Cards**

Top metric row displaying:
- Total Active Talents
- Total Active Projects & Pipeline Value
- Pending New Inquiries
- Upcoming Shoots This Week

- [ ] **Step 2: Build `TalentRoster.jsx` & `AddTalentModal.jsx`**

- Talent Roster table/grid view with one-click status toggle pills (`Available`, `On Shooting`, `Off Duty`).
- Displays internal fee vs public rate card.
- Modal to register a new talent into the SQLite DB.

- [ ] **Step 3: Build `KanbanPipeline.jsx`**

5 Column Kanban Board:
- `New Leads` (public booking inquiries arrive here automatically)
- `Quotation Sent`
- `Confirmed`
- `In Execution`
- `Completed`

Each deal card shows Brand Name, Project Type, Assigned Talent, Budget, and Date. Includes quick stage movement buttons/dropdown to shift deals across columns.

- [ ] **Step 4: Build `MasterCalendar.jsx`**

Visual monthly calendar showing color-coded schedule badges:
- 🟣 Shooting / Production
- 🔵 Content Post / Publish
- 🟠 Fitting / Meeting
- 🔴 Payment / Invoice

Includes "+ Add Schedule Event" button and talent filtering.

---

### Task 6: Full System Integration & Verification

**Files:**
- Modify: `src/App.jsx`
- Test: Full build and runtime verification

- [ ] **Step 1: Connect App State & Real-Time Sync in `src/App.jsx`**

Integrate state sync: when a user submits a booking on the public landing page, switching to the CRM view immediately fetches and displays the new lead in the Kanban `New Leads` column.

- [ ] **Step 2: Run Automated Build Check**

Run: `npm run build`
Expected: Clean production build with zero React syntax or bundling errors.

- [ ] **Step 3: End-to-End Functional Verification**

1. Launch backend: `node backend/server.js`
2. Launch frontend: `npm run client`
3. Verify Public Marketing Page -> View Talent -> Submit Inquiry -> Switch View to Agency CRM -> Verify New Lead in Kanban -> Update Talent Status -> Add Schedule Event.

---

## Plan Complete

**Plan complete and saved to [`docs/superpowers/plans/2026-08-24-talent-crm-dashboard-plan.md`](file:///Users/dodo/Documents/CRM%20dashboard/docs/superpowers/plans/2026-08-24-talent-crm-dashboard-plan.md). Two execution options:**

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints.

**Which approach?**
