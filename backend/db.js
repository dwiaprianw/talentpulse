import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure backend/database directory exists
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'crm_talent.db');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log(`Connected to SQLite database at ${dbPath}`);
  }
});

// Enable Foreign Keys
db.run('PRAGMA foreign_keys = ON;');

// Initialize tables
export function initDB() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Talents Table
      db.run(`
        CREATE TABLE IF NOT EXISTS talents (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          title TEXT NOT NULL,
          category TEXT NOT NULL,
          avatar_url TEXT,
          bio TEXT,
          niche_tags TEXT,
          followers TEXT,
          engagement_rate TEXT,
          internal_fee TEXT,
          rate_card TEXT,
          status TEXT DEFAULT 'available',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Projects Table (Kanban Pipeline)
      db.run(`
        CREATE TABLE IF NOT EXISTS projects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          brand_name TEXT NOT NULL,
          contact_person TEXT,
          email TEXT,
          phone TEXT,
          project_title TEXT NOT NULL,
          project_type TEXT,
          target_date TEXT,
          budget_range TEXT,
          status_stage TEXT DEFAULT 'new_lead',
          talent_id INTEGER,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (talent_id) REFERENCES talents(id) ON DELETE SET NULL
        )
      `);

      // Schedules Table (Master Calendar)
      db.run(`
        CREATE TABLE IF NOT EXISTS schedules (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          project_id INTEGER,
          talent_id INTEGER,
          title TEXT NOT NULL,
          event_type TEXT NOT NULL,
          event_date TEXT NOT NULL,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
          FOREIGN KEY (talent_id) REFERENCES talents(id) ON DELETE SET NULL
        )
      `, (err) => {
        if (err) {
          console.error('Error initializing tables:', err);
          reject(err);
        } else {
          console.log('Database tables initialized successfully.');
          resolve();
        }
      });
    });
  });
}

// Helper query wrappers for promise-based async/await syntax
export const dbQuery = {
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }
};

export default db;
