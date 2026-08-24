import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Talent CRM & Marketing Showcase API is running',
    timestamp: new Date().toISOString()
  });
});

// Initialize database schema and start server
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Talent CRM Backend Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to initialize database on server start:', err);
    process.exit(1);
  });

export default app;
