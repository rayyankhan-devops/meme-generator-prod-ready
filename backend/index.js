import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MySQL connection pool configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'memedb',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  connectTimeout: 5000
};

// Built-in fallback memes in case MySQL connection is not active yet
const FALLBACK_MEMES = [
  {
    id: 9991,
    title: 'Offline Mode: Works on My Machine',
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    caption: 'Database connection offline. Attach MySQL container to load pre-seeded memes!',
    category: 'fallback'
  },
  {
    id: 9992,
    title: 'Offline Mode: CSS Alignment Stress',
    image_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    caption: 'display: flex; align-items: center; justify-content: center;',
    category: 'fallback'
  },
  {
    id: 9993,
    title: 'Offline Mode: Friday Deployment',
    image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    caption: 'Deploying at 4:59 PM on Friday. What could go wrong?',
    category: 'fallback'
  }
];

let pool;

try {
  pool = mysql.createPool(dbConfig);
} catch (err) {
  console.warn('MySQL pool initialization error:', err.message);
}

// Single API Endpoint: Get Random Meme
app.get('/api/meme/random', async (req, res) => {
  try {
    if (!pool) {
      throw new Error('Database pool not initialized');
    }
    const [rows] = await pool.query('SELECT * FROM memes ORDER BY RAND() LIMIT 1');
    
    if (rows && rows.length > 0) {
      return res.json({
        success: true,
        source: 'database',
        data: rows[0]
      });
    } else {
      throw new Error('No memes found in database table');
    }
  } catch (error) {
    console.warn(`[DB Warning]: ${error.message}. Returning fallback meme.`);
    
    const randomFallback = FALLBACK_MEMES[Math.floor(Math.random() * FALLBACK_MEMES.length)];
    return res.json({
      success: true,
      source: 'fallback',
      message: 'Database offline or table empty. Showing default meme.',
      data: randomFallback
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Backend server listening on http://localhost:${PORT}`);
    console.log(`📍 Random Meme API Endpoint: http://localhost:${PORT}/api/meme/random`);
  });
}

export default app;
