const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./urls.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    // Create table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_url TEXT NOT NULL,
      short_key TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// Routes
app.post('/api/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  
  if (!originalUrl) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const shortKey = nanoid(6);
    db.run(
      'INSERT INTO urls (original_url, short_key) VALUES (?, ?)',
      [originalUrl, shortKey],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            // If short_key already exists, try again
            return res.status(500).json({ error: 'Please try again' });
          }
          return res.status(500).json({ error: 'Database error' });
        }
        res.json({
          originalUrl,
          shortUrl: `http://localhost:${port}/${shortKey}`,
          shortKey
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/urls', (req, res) => {
  db.all('SELECT * FROM urls ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.get('/:shortKey', (req, res) => {
  const { shortKey } = req.params;
  
  db.get('SELECT original_url FROM urls WHERE short_key = ?', [shortKey], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'URL not found' });
    }
    res.redirect(row.original_url);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 