import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB, dbQuery } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Demo Users & Credentials
const DEMO_USERS = [
  {
    id: 1,
    name: 'Super Admin',
    email: 'admin@talentpulse.id',
    password: 'admin123',
    pin: '8888',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    token: 'tp-token-admin-8888'
  },
  {
    id: 2,
    name: 'Account Manager',
    email: 'manager@talentpulse.id',
    password: 'manager123',
    pin: '5555',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    token: 'tp-token-manager-5555'
  }
];

// Helper to extract role from request header
function getUserRole(req) {
  const roleHeader = req.headers['x-user-role'];
  if (roleHeader) return roleHeader.toLowerCase();

  const authHeader = req.headers['authorization'];
  if (authHeader) {
    if (authHeader.includes('admin') || authHeader.includes('8888')) return 'admin';
    if (authHeader.includes('manager') || authHeader.includes('5555')) return 'manager';
  }

  // Fallback for Vercel / serverless demo environment when no header is present
  if (process.env.VERCEL) {
    return 'admin';
  }

  return 'admin';
}

// Middleware to require specific roles
function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    const role = getUserRole(req);
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        error: 'Access Denied: Insufficient permissions for this action',
        requiredRoles: allowedRoles,
        currentRole: role
      });
    }
    req.userRole = role;
    next();
  };
}

// Helper to safely parse JSON strings or return fallback
function safeJsonParse(val, fallback = null) {
  if (!val) return fallback;
  if (typeof val !== 'string') return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback !== null ? fallback : val;
  }
}

// Helper to format talent entity for client response
function formatTalent(talent) {
  if (!talent) return talent;
  let niche_tags = safeJsonParse(talent.niche_tags, null);
  if (!Array.isArray(niche_tags)) {
    if (typeof talent.niche_tags === 'string' && talent.niche_tags.trim().length > 0) {
      niche_tags = talent.niche_tags.split(',').map((s) => s.trim()).filter(Boolean);
    } else {
      niche_tags = [];
    }
  }

  let rate_card = safeJsonParse(talent.rate_card, talent.rate_card);

  return {
    ...talent,
    niche_tags,
    rate_card
  };
}

// ==========================================
// 1. HEALTH CHECK & AUTHENTICATION
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Talent CRM & Marketing Showcase API is running',
    timestamp: new Date().toISOString()
  });
});

// POST /api/auth/login - Authenticate user credentials or PIN
app.post('/api/auth/login', (req, res) => {
  const { email, password, pin } = req.body;

  let matchedUser = null;
  if (pin) {
    matchedUser = DEMO_USERS.find((u) => u.pin === String(pin).trim());
  } else if (email) {
    matchedUser = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === String(email).toLowerCase().trim() && u.password === String(password).trim()
    );
  }

  if (!matchedUser) {
    return res.status(401).json({
      error: 'Kredensial atau PIN tidak valid. Gunakan PIN 8888 (Admin) atau 5555 (Manager).'
    });
  }

  res.json({
    success: true,
    user: {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
      avatar: matchedUser.avatar
    },
    token: matchedUser.token
  });
});

// ==========================================
// 2. AGENCY DASHBOARD STATS
// ==========================================
app.get('/api/stats', async (req, res) => {
  try {
    const activeTalentsRow = await dbQuery.get(
      "SELECT COUNT(*) as count FROM talents WHERE status != 'unavailable'"
    );
    const totalTalentsRow = await dbQuery.get("SELECT COUNT(*) as count FROM talents");
    const activeProjectsRow = await dbQuery.get(
      "SELECT COUNT(*) as count FROM projects WHERE status_stage != 'completed'"
    );
    const pendingLeadsRow = await dbQuery.get(
      "SELECT COUNT(*) as count FROM projects WHERE status_stage = 'new_lead'"
    );
    const weekShootsRow = await dbQuery.get(
      "SELECT COUNT(*) as count FROM schedules WHERE event_type IN ('shooting', 'shoot')"
    );

    res.json({
      activeTalents: activeTalentsRow ? activeTalentsRow.count : 0,
      totalTalents: totalTalentsRow ? totalTalentsRow.count : 0,
      activeProjects: activeProjectsRow ? activeProjectsRow.count : 0,
      pendingLeads: pendingLeadsRow ? pendingLeadsRow.count : 0,
      weekShoots: weekShootsRow ? weekShootsRow.count : 0
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch statistics', details: err.message });
  }
});

// ==========================================
// 3. TALENTS ENDPOINTS
// ==========================================

// GET /api/talents - List all talents (supports ?category=)
app.get('/api/talents', async (req, res) => {
  try {
    const { category } = req.query;
    let sql = 'SELECT * FROM talents';
    const params = [];

    if (category && category.trim() !== '' && category.toLowerCase() !== 'all') {
      sql += ' WHERE LOWER(category) = LOWER(?)';
      params.push(category.trim());
    }

    sql += ' ORDER BY id ASC';

    const talents = await dbQuery.all(sql, params);
    const formatted = talents.map(formatTalent);
    res.json(formatted);
  } catch (err) {
    console.error('Error fetching talents:', err);
    res.status(500).json({ error: 'Failed to fetch talents', details: err.message });
  }
});

// GET /api/talents/:id - Get single talent by ID
app.get('/api/talents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const talent = await dbQuery.get('SELECT * FROM talents WHERE id = ?', [id]);
    if (!talent) {
      return res.status(404).json({ error: `Talent with ID ${id} not found` });
    }
    res.json(formatTalent(talent));
  } catch (err) {
    console.error(`Error fetching talent ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to fetch talent', details: err.message });
  }
});

// POST /api/talents - Create new talent (Protected: Require admin or manager)
app.post('/api/talents', requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const {
      name,
      title,
      category,
      avatar_url,
      bio,
      niche_tags,
      followers,
      engagement_rate,
      internal_fee,
      rate_card,
      status
    } = req.body;

    if (!name || !title || !category) {
      return res.status(400).json({ error: 'name, title, and category are required' });
    }

    const nicheTagsStr = Array.isArray(niche_tags)
      ? JSON.stringify(niche_tags)
      : typeof niche_tags === 'string'
      ? niche_tags
      : JSON.stringify([]);

    const rateCardStr =
      typeof rate_card === 'object' && rate_card !== null
        ? JSON.stringify(rate_card)
        : rate_card || '';

    const talentStatus = status || 'available';

    const result = await dbQuery.run(
      `INSERT INTO talents (name, title, category, avatar_url, bio, niche_tags, followers, engagement_rate, internal_fee, rate_card, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        title,
        category,
        avatar_url || '',
        bio || '',
        nicheTagsStr,
        followers || '0',
        engagement_rate || '0%',
        internal_fee || 'Rp 0',
        rateCardStr,
        talentStatus
      ]
    );

    const newTalent = await dbQuery.get('SELECT * FROM talents WHERE id = ?', [result.lastID]);
    res.status(201).json(formatTalent(newTalent));
  } catch (err) {
    console.error('Error creating talent:', err);
    res.status(500).json({ error: 'Failed to create talent', details: err.message });
  }
});

// PUT /api/talents/:id - Update talent details (Protected: Require admin or manager)
app.put('/api/talents/:id', requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await dbQuery.get('SELECT * FROM talents WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: `Talent with ID ${id} not found` });
    }

    const {
      name = existing.name,
      title = existing.title,
      category = existing.category,
      avatar_url = existing.avatar_url,
      bio = existing.bio,
      niche_tags = existing.niche_tags,
      followers = existing.followers,
      engagement_rate = existing.engagement_rate,
      internal_fee = existing.internal_fee,
      rate_card = existing.rate_card,
      status = existing.status
    } = req.body;

    const nicheTagsStr = Array.isArray(niche_tags)
      ? JSON.stringify(niche_tags)
      : typeof niche_tags === 'string'
      ? niche_tags
      : existing.niche_tags;

    const rateCardStr =
      typeof rate_card === 'object' && rate_card !== null
        ? JSON.stringify(rate_card)
        : typeof rate_card === 'string'
        ? rate_card
        : existing.rate_card;

    await dbQuery.run(
      `UPDATE talents SET
        name = ?,
        title = ?,
        category = ?,
        avatar_url = ?,
        bio = ?,
        niche_tags = ?,
        followers = ?,
        engagement_rate = ?,
        internal_fee = ?,
        rate_card = ?,
        status = ?
       WHERE id = ?`,
      [
        name,
        title,
        category,
        avatar_url,
        bio,
        nicheTagsStr,
        followers,
        engagement_rate,
        internal_fee,
        rateCardStr,
        status,
        id
      ]
    );

    const updated = await dbQuery.get('SELECT * FROM talents WHERE id = ?', [id]);
    res.json(formatTalent(updated));
  } catch (err) {
    console.error(`Error updating talent ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to update talent', details: err.message });
  }
});

// PATCH /api/talents/:id/status - Update talent status (Protected: Require admin or manager)
app.patch('/api/talents/:id/status', requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    const existing = await dbQuery.get('SELECT * FROM talents WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: `Talent with ID ${id} not found` });
    }

    await dbQuery.run('UPDATE talents SET status = ? WHERE id = ?', [status, id]);
    const updated = await dbQuery.get('SELECT * FROM talents WHERE id = ?', [id]);
    res.json(formatTalent(updated));
  } catch (err) {
    console.error(`Error updating talent status ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to update talent status', details: err.message });
  }
});

// DELETE /api/talents/:id - Delete talent (Protected: Require admin)
app.delete('/api/talents/:id', requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await dbQuery.get('SELECT * FROM talents WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: `Talent with ID ${id} not found` });
    }

    await dbQuery.run('DELETE FROM talents WHERE id = ?', [id]);
    res.json({ success: true, message: `Talent ${id} deleted successfully`, id: Number(id) });
  } catch (err) {
    console.error(`Error deleting talent ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to delete talent', details: err.message });
  }
});

// ==========================================
// 4. PROJECTS ENDPOINTS (Kanban Pipeline)
// ==========================================

// GET /api/projects - List all projects with joined talent details
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await dbQuery.all(`
      SELECT 
        p.*,
        t.name AS talent_name,
        t.avatar_url AS talent_avatar,
        t.category AS talent_category,
        t.title AS talent_title
      FROM projects p
      LEFT JOIN talents t ON p.talent_id = t.id
      ORDER BY p.id DESC
    `);
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects', details: err.message });
  }
});

// GET /api/projects/:id - Single project
app.get('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await dbQuery.get(
      `
      SELECT 
        p.*,
        t.name AS talent_name,
        t.avatar_url AS talent_avatar,
        t.category AS talent_category,
        t.title AS talent_title
      FROM projects p
      LEFT JOIN talents t ON p.talent_id = t.id
      WHERE p.id = ?
    `,
      [id]
    );

    if (!project) {
      return res.status(404).json({ error: `Project with ID ${id} not found` });
    }
    res.json(project);
  } catch (err) {
    console.error(`Error fetching project ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to fetch project', details: err.message });
  }
});

// POST /api/projects - Create a new project / client booking lead (Open to guests for landing page brief submission)
app.post('/api/projects', async (req, res) => {
  try {
    const {
      brand_name,
      contact_person,
      email,
      phone,
      project_title,
      project_type,
      target_date,
      budget_range,
      status_stage,
      talent_id,
      notes
    } = req.body;

    if (!brand_name && !project_title) {
      return res.status(400).json({ error: 'brand_name or project_title is required' });
    }

    const finalBrandName = brand_name || 'Client Inquiry';
    const finalProjectTitle =
      project_title || `${finalBrandName} - ${project_type || 'Campaign'}`;
    const finalStatusStage = status_stage || 'new_lead';
    const finalContactPerson = contact_person || finalBrandName;

    const result = await dbQuery.run(
      `INSERT INTO projects (brand_name, contact_person, email, phone, project_title, project_type, target_date, budget_range, status_stage, talent_id, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        finalBrandName,
        finalContactPerson,
        email || '',
        phone || '',
        finalProjectTitle,
        project_type || 'General Campaign',
        target_date || '',
        budget_range || '',
        finalStatusStage,
        talent_id || null,
        notes || ''
      ]
    );

    const newProject = await dbQuery.get(
      `
      SELECT 
        p.*,
        t.name AS talent_name,
        t.avatar_url AS talent_avatar,
        t.category AS talent_category,
        t.title AS talent_title
      FROM projects p
      LEFT JOIN talents t ON p.talent_id = t.id
      WHERE p.id = ?
    `,
      [result.lastID]
    );

    res.status(201).json(newProject);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: 'Failed to create project', details: err.message });
  }
});

// PUT /api/projects/:id - Update full project (Protected: Require admin or manager)
app.put('/api/projects/:id', requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await dbQuery.get('SELECT * FROM projects WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: `Project with ID ${id} not found` });
    }

    const {
      brand_name = existing.brand_name,
      contact_person = existing.contact_person,
      email = existing.email,
      phone = existing.phone,
      project_title = existing.project_title,
      project_type = existing.project_type,
      target_date = existing.target_date,
      budget_range = existing.budget_range,
      status_stage = existing.status_stage,
      talent_id = existing.talent_id,
      notes = existing.notes
    } = req.body;

    await dbQuery.run(
      `UPDATE projects SET
        brand_name = ?,
        contact_person = ?,
        email = ?,
        phone = ?,
        project_title = ?,
        project_type = ?,
        target_date = ?,
        budget_range = ?,
        status_stage = ?,
        talent_id = ?,
        notes = ?
       WHERE id = ?`,
      [
        brand_name,
        contact_person,
        email,
        phone,
        project_title,
        project_type,
        target_date,
        budget_range,
        status_stage,
        talent_id,
        notes,
        id
      ]
    );

    const updated = await dbQuery.get(
      `
      SELECT 
        p.*,
        t.name AS talent_name,
        t.avatar_url AS talent_avatar,
        t.category AS talent_category,
        t.title AS talent_title
      FROM projects p
      LEFT JOIN talents t ON p.talent_id = t.id
      WHERE p.id = ?
    `,
      [id]
    );

    res.json(updated);
  } catch (err) {
    console.error(`Error updating project ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to update project', details: err.message });
  }
});

// PATCH /api/projects/:id/stage - Update project Kanban stage (Protected: Require admin or manager)
app.patch('/api/projects/:id/stage', requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { id } = req.params;
    const status_stage = req.body.status_stage || req.body.stage;

    if (!status_stage) {
      return res.status(400).json({ error: 'status_stage or stage is required' });
    }

    const existing = await dbQuery.get('SELECT * FROM projects WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: `Project with ID ${id} not found` });
    }

    await dbQuery.run('UPDATE projects SET status_stage = ? WHERE id = ?', [status_stage, id]);

    const updated = await dbQuery.get(
      `
      SELECT 
        p.*,
        t.name AS talent_name,
        t.avatar_url AS talent_avatar,
        t.category AS talent_category,
        t.title AS talent_title
      FROM projects p
      LEFT JOIN talents t ON p.talent_id = t.id
      WHERE p.id = ?
    `,
      [id]
    );

    res.json(updated);
  } catch (err) {
    console.error(`Error updating project stage ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to update project stage', details: err.message });
  }
});

// DELETE /api/projects/:id - Delete project (Protected: Require admin)
app.delete('/api/projects/:id', requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await dbQuery.get('SELECT * FROM projects WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: `Project with ID ${id} not found` });
    }

    await dbQuery.run('DELETE FROM projects WHERE id = ?', [id]);
    res.json({ success: true, message: `Project ${id} deleted successfully`, id: Number(id) });
  } catch (err) {
    console.error(`Error deleting project ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to delete project', details: err.message });
  }
});

// ==========================================
// 5. SCHEDULES ENDPOINTS (Master Calendar)
// ==========================================

// GET /api/schedules - List all schedules with joined talent and project info
app.get('/api/schedules', async (req, res) => {
  try {
    const schedules = await dbQuery.all(`
      SELECT 
        s.*,
        t.name AS talent_name,
        t.avatar_url AS talent_avatar,
        t.category AS talent_category,
        p.brand_name,
        p.project_title
      FROM schedules s
      LEFT JOIN talents t ON s.talent_id = t.id
      LEFT JOIN projects p ON s.project_id = p.id
      ORDER BY s.event_date ASC, s.id ASC
    `);
    res.json(schedules);
  } catch (err) {
    console.error('Error fetching schedules:', err);
    res.status(500).json({ error: 'Failed to fetch schedules', details: err.message });
  }
});

// POST /api/schedules - Create new schedule event (Protected: Require admin or manager)
app.post('/api/schedules', requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { project_id, talent_id, title, event_type, event_date, notes } = req.body;

    if (!title || !event_type || !event_date) {
      return res.status(400).json({ error: 'title, event_type, and event_date are required' });
    }

    const result = await dbQuery.run(
      `INSERT INTO schedules (project_id, talent_id, title, event_type, event_date, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        project_id || null,
        talent_id || null,
        title,
        event_type,
        event_date,
        notes || ''
      ]
    );

    const newSchedule = await dbQuery.get(
      `
      SELECT 
        s.*,
        t.name AS talent_name,
        t.avatar_url AS talent_avatar,
        t.category AS talent_category,
        p.brand_name,
        p.project_title
      FROM schedules s
      LEFT JOIN talents t ON s.talent_id = t.id
      LEFT JOIN projects p ON s.project_id = p.id
      WHERE s.id = ?
    `,
      [result.lastID]
    );

    res.status(201).json(newSchedule);
  } catch (err) {
    console.error('Error creating schedule:', err);
    res.status(500).json({ error: 'Failed to create schedule', details: err.message });
  }
});

// DELETE /api/schedules/:id - Delete schedule event (Protected: Require admin or manager)
app.delete('/api/schedules/:id', requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await dbQuery.get('SELECT * FROM schedules WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: `Schedule with ID ${id} not found` });
    }

    await dbQuery.run('DELETE FROM schedules WHERE id = ?', [id]);
    res.json({ success: true, message: `Schedule ${id} deleted successfully`, id: Number(id) });
  } catch (err) {
    console.error(`Error deleting schedule ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to delete schedule', details: err.message });
  }
});

// ==========================================
// INITIALIZE & START SERVER
// ==========================================
export async function startServer(port = PORT) {
  await initDB();
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      console.log(`🚀 Talent CRM Backend Server running on http://localhost:${port}`);
      resolve(server);
    });
  });
}

// Start server if this is the main module
if (process.argv[1] && (process.argv[1].endsWith('server.js') || process.argv[1].endsWith('server'))) {
  startServer().catch((err) => {
    console.error('❌ Failed to initialize database on server start:', err);
    process.exit(1);
  });
}

export default app;
