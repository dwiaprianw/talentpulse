# Talent CRM Dashboard & Public Marketing Profile Design Specification

**Date:** 2026-08-24  
**Project:** Talent Management CRM & Public Marketing Showcase  
**Architecture:** Full-Stack (Vite + React Frontend + Node.js/Express Backend + SQLite Database)  
**Design Aesthetic:** Vibrant Creative Studio (Gradient Meshes, Neon Accents, Glassmorphism, Micro-animations)

---

## 1. Executive Summary & Product Vision

The **Talent Management CRM & Marketing Showcase** is a dual-view platform built for hybrid talent agencies managing diverse talent rosters (Influencers, Models/Actors, Creative Professionals like Photographers, Videographers, Designers).

### Primary Goals:
1. **Public Marketing Showcase & Client Portal:** An engaging, vibrant landing page where brands and clients can explore talent rosters, filter by category/niche, view rich talent portfolios & rate cards, and submit booking inquiries.
2. **Internal CRM Agency Dashboard:** An operational hub for agency managers to handle:
   - **Talent Roster Management:** Track talent availability status (`Available`, `On Shooting`, `Off Duty`), internal fees vs public rate cards, and profile details.
   - **Project Kanban Pipeline:** 5-stage deal flow (`New Lead` -> `Quotation` -> `Confirmed` -> `In Execution` -> `Completed`) where public booking inquiries automatically arrive as real-time leads.
   - **Master Schedule Calendar:** A visual calendar tracking shooting dates, content publishing deadlines, fittings, and client meetings color-coded per talent.
3. **Robust Local Database:** Full-stack integration powered by a local **SQLite database** file (`crm_talent.db`), exposing clean REST APIs for seamless data persistence and rapid execution.

---

## 2. System Architecture & Tech Stack

```
+-------------------------------------------------------------------------+
|                              FRONTEND                                   |
|                Vite + React (Vibrant Creative Studio UI)                |
|  +-----------------------------------+-------------------------------+  |
|  |       Public Landing Page         |      Internal CRM Portal      |  |
|  | - Hero Banner & Search            | - KPI Overview Cards          |  |
|  | - Filterable Talent Catalog       | - Talent Roster Manager       |  |
|  | - Talent Portfolio & Rates Modal  | - Project Kanban Pipeline     |  |
|  | - Public Client Booking Form      | - Master Schedule Calendar    |  |
|  +-----------------------------------+-------------------------------+  |
|                                   |                                     |
|                       REST API (HTTP / JSON)                            |
|                                   v                                     |
+-------------------------------------------------------------------------+
|                              BACKEND                                    |
|                       Node.js + Express Server                          |
|         - REST API Routers (/api/talents, /api/projects, etc.)          |
|         - CORS, Body Parser, Error Handling                             |
|                                   |                                     |
|                              SQLite DB                                  |
|         - crm_talent.db (Tables: talents, projects, schedules)         |
+-------------------------------------------------------------------------+
```

### Stack Details:
- **Frontend:** Vite, React 18, Lucide React (Icons), Vanilla CSS Modules / Global Design System (`Plus Jakarta Sans` & `Outfit` Google Fonts).
- **Backend API:** Node.js, Express.js, CORS, sqlite3 / sqlite driver.
- **Database:** SQLite 3 (`backend/database/crm_talent.db`).
- **Data Pre-seeding:** Automatic pre-population of realistic talent rosters (5+ multi-category talents), active Kanban projects, and schedule events upon first database initialization.

---

## 3. Database Schema (SQLite)

### Table 1: `talents`
```sql
CREATE TABLE IF NOT EXISTS talents (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- 'influencer', 'model', 'creative', 'hybrid'
    avatar_url TEXT,
    bio TEXT,
    niche_tags TEXT, -- JSON string array e.g. ["Fashion", "Tech"]
    followers TEXT, -- e.g. "250K"
    engagement_rate TEXT, -- e.g. "4.8%"
    internal_fee INTEGER NOT NULL, -- e.g. 5000000
    rate_card TEXT, -- JSON string object with package tiers
    status TEXT NOT NULL DEFAULT 'available', -- 'available', 'on_shoot', 'unavailable'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table 2: `projects`
```sql
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    brand_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    project_title TEXT NOT NULL,
    project_type TEXT NOT NULL, -- 'Social Media Campaign', 'Photoshoot', 'Commercial', 'Event'
    target_date TEXT,
    budget_range TEXT,
    status_stage TEXT NOT NULL DEFAULT 'new_lead', -- 'new_lead', 'quotation', 'confirmed', 'execution', 'completed'
    talent_id TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (talent_id) REFERENCES talents(id) ON DELETE SET NULL
);
```

### Table 3: `schedules`
```sql
CREATE TABLE IF NOT EXISTS schedules (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    talent_id TEXT NOT NULL,
    title TEXT NOT NULL,
    event_type TEXT NOT NULL, -- 'shoot', 'posting', 'meeting', 'payment'
    event_date TEXT NOT NULL, -- YYYY-MM-DD
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (talent_id) REFERENCES talents(id) ON DELETE CASCADE
);
```

---

## 4. REST API Specification

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/stats` | Returns overall agency KPI summary (talents count, active projects, pending leads, week shoots) |
| `GET` | `/api/talents` | Retrieves list of talents (supports optional `?category=` filter) |
| `POST` | `/api/talents` | Creates a new talent in roster |
| `PUT` | `/api/talents/:id` | Updates talent profile details and rate cards |
| `PATCH` | `/api/talents/:id/status` | Updates talent availability status (`available`, `on_shoot`, `unavailable`) |
| `GET` | `/api/projects` | Retrieves all projects for Kanban board |
| `POST` | `/api/projects` | Creates a new project lead (invoked by Public Client Booking Form) |
| `PATCH` | `/api/projects/:id/stage` | Updates project Kanban stage e.g. move to `confirmed` |
| `GET` | `/api/schedules` | Retrieves all calendar schedule events |
| `POST` | `/api/schedules` | Creates a new schedule event tied to a talent |
| `DELETE` | `/api/schedules/:id` | Removes a schedule event |

---

## 5. UI/UX & Design System (*Vibrant Creative Studio*)

### Color Palette:
- **Base:** Deep Slate Glass Canvas (`#0F172A` / `#1E293B`) & Clean Vibrant Backgrounds.
- **Accents:**
  - Neon Indigo / Purple: `#8B5CF6` (Branding & Primary CTAs)
  - Vibrant Pink / Magenta: `#EC4899` (Creative & Highlight Badges)
  - Electric Blue: `#3B82F6` (Influencer Category & Project Status)
  - Emerald Green: `#10B981` (Available Status & Confirmed Stage)
  - Warm Amber: `#F59E0B` (On Shoot & Pending Quotations)

### Typography:
- **Display Headings:** `Outfit`, sans-serif (Bold 700/800, vibrant gradient text fills).
- **UI & Data Text:** `Plus Jakarta Sans`, sans-serif (Clean legibility across data tables & cards).

---

## 6. Verification & Quality Assurance Plan

### Automated Verification:
- **Backend API Tests:** Run health-check script to verify Express REST endpoints (`/api/talents`, `/api/projects`, `/api/schedules`, `/api/stats`) and SQLite database CRUD operations.
- **Vite Build Verification:** Run `npm run build` to ensure zero compilation or syntax errors.

### Manual Verification:
- **Public Flow:** Open Landing Page -> Filter by "Influencer" / "Model" -> View Talent Profile Modal -> Submit Inquiry Form -> Confirm success modal appears.
- **CRM Portal Flow:** Switch View to CRM Portal -> Confirm newly created lead appears in "New Leads" Kanban column -> Move project card to "Deal Confirmed" -> Change Talent Status -> Add Shoot Event in Schedule Calendar.
