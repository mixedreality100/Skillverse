import express from "express";
import cors from "cors";
import db from "./db/db.js";
import dotenv from 'dotenv';
import { requireAuth } from '@clerk/express';   

dotenv.config();

const app = express();
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Clerk middleware configuration
app.use(
  requireAuth({
    secretKey: process.env.CLERK_SECRET_KEY,
  })
);

// Middleware to enhance auth object
app.use((req, res, next) => {
  if (req.auth) {
    // Add fallback values and sanitize data
    req.auth.sanitizedUser = {
      userId: req.auth.userId,
      email: req.auth.email || 'no-email@example.com',
      firstName: req.auth.firstName || 'Anonymous',
      lastName: req.auth.lastName || '',
      imageUrl: req.auth.imageUrl || '/default-avatar.png'
    };
  }
  next();
});

app.post("/api/saveUser", async (req, res) => {
  try {
    const { sanitizedUser } = req.auth;
    const fullName = `${sanitizedUser.firstName} ${sanitizedUser.lastName}`.trim();

    const existingUser = await db.query(
      "SELECT * FROM users WHERE clerk_user_id = $1",
      [sanitizedUser.userId]
    );

    if (existingUser.rows.length === 0) {
      await db.query(
        `INSERT INTO users (clerk_user_id, email, name, picture_url, is_content_creator, progress) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          sanitizedUser.userId,
          sanitizedUser.email,
          fullName || 'Anonymous User',
          sanitizedUser.imageUrl,
          false,
          JSON.stringify({ totalLessons: 10, completedLessons: 0 })
        ]
      );
    } else {
      await db.query(
        `UPDATE users 
         SET email = $2, name = $3, picture_url = $4 
         WHERE clerk_user_id = $1`,
        [
          sanitizedUser.userId,
          sanitizedUser.email,
          fullName,
          sanitizedUser.imageUrl
        ]
      );
    }

    res.status(200).json({ 
      message: "User saved successfully", 
      userId: sanitizedUser.userId 
    });
  } catch (error) {
    console.error("❌ Database error:", error);
    res.status(500).json({ 
      error: "Database error",
      details: error.message 
    });
  }
});

app.get("/api/userProgress", async (req, res) => {
  try {
    const { userId } = req.auth.sanitizedUser;
    const userProgressResult = await db.query(
      "SELECT progress FROM users WHERE clerk_user_id = $1",
      [userId]
    );
    
    const progress = userProgressResult.rows[0]?.progress || 
                   { totalLessons: 10, completedLessons: 0 };
    
    res.status(200).json(progress);
  } catch (error) {
    console.error("❌ Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});