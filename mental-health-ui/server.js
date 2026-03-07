// mental-health-ui/server.js
import express from 'express';
import cors from 'cors';
// FIXED: Removed the curly braces { } around db
import db from '../db.js'; 

const app = express();
app.use(cors());
app.use(express.json());

// Example Route to test connection
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    res.json({ message: "Database connected!", data: rows });
  } catch (err) {
    console.error("DB Connection Error:", err);
    res.status(500).json({ error: "Failed to connect to database" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});