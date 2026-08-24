import app, { startServer } from '../backend/server.js';
import { initDB, dbQuery } from '../backend/db.js';
import { seed } from '../backend/seed.js';

let isInitialized = false;

export default async function handler(req, res) {
  if (!isInitialized) {
    try {
      await initDB();
      const countRow = await dbQuery.get('SELECT COUNT(*) as count FROM talents').catch(() => ({ count: 0 }));
      if (!countRow || countRow.count === 0) {
        await seed().catch((err) => console.warn('Vercel seed warning:', err));
      }
      isInitialized = true;
    } catch (err) {
      console.warn('Vercel init error:', err);
    }
  }

  return app(req, res);
}
