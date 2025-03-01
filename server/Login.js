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

    // First check if user exists
    const existingUser = await db.query(
      "SELECT * FROM users WHERE clerk_user_id = $1",
      [sanitizedUser.userId]
    );

    if (existingUser.rows.length === 0) {
      // Create new user if doesn't exist
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

      res.status(201).json({ message: "User created successfully" });
    } else {
      // Update existing user
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

      res.status(200).json({ message: "User updated successfully" });
    }
  } catch (error) {
    console.error("❌ Error saving user:", error);
    res.status(500).json({ 
      error: "Failed to save user", 
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

app.post("/api/enrollCourse/:courseId", async (req, res) => {
  try {
    const { userId } = req.auth.sanitizedUser;
    const { courseId } = req.params;

    // First get the database user_id from users table
    const userResult = await db.query(
      "SELECT id FROM users WHERE clerk_user_id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const dbUserId = userResult.rows[0].id;

    // Check if already enrolled
    const existingEnrollment = await db.query(
      "SELECT * FROM course_enrollment WHERE user_id = $1 AND course_id = $2",
      [dbUserId, courseId]
    );

    if (existingEnrollment.rows.length > 0) {
      return res.status(200).json({ 
        message: "Already enrolled", 
        enrollment: existingEnrollment.rows[0]
      });
    }

    // Create new enrollment with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const newEnrollment = await db.query(
      `INSERT INTO course_enrollment (user_id, course_id, enrollment_date) 
       VALUES ($1, $2, $3) RETURNING *`,
      [dbUserId, courseId, currentDate]
    );

    res.status(201).json({
      message: "Successfully enrolled",
      enrollment: newEnrollment.rows[0]
    });
  } catch (error) {
    console.error("❌ Enrollment error:", error);
    res.status(500).json({ error: "Enrollment failed", details: error.message });
  }
});

app.get("/api/checkEnrollment/:courseId", async (req, res) => {
  try {
    const { userId } = req.auth.sanitizedUser;
    const { courseId } = req.params;

    // First get the database user_id
    const userResult = await db.query(
      "SELECT id FROM users WHERE clerk_user_id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const dbUserId = userResult.rows[0].id;

    // Check enrollment with the actual user_id
    const enrollment = await db.query(
      "SELECT * FROM course_enrollment WHERE user_id = $1 AND course_id = $2",
      [dbUserId, courseId]
    );

    res.status(200).json({
      isEnrolled: enrollment.rows.length > 0,
      enrollment: enrollment.rows[0] || null
    });
  } catch (error) {
    console.error("❌ Enrollment check error:", error);
    res.status(500).json({ error: "Failed to check enrollment" });
  }
});

app.post("/api/updateCourseCompletion/:courseId", async (req, res) => {
  try {
    const { userId } = req.auth.sanitizedUser;
    const { courseId } = req.params;
    const { completionStatus } = req.body;

    // Get the database user_id
    const userResult = await db.query(
      "SELECT id FROM users WHERE clerk_user_id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const dbUserId = userResult.rows[0].id;

    // Update completion status
    const updateResult = await db.query(
      `UPDATE course_enrollment 
       SET completion_status = $1 
       WHERE user_id = $2 AND course_id = $3 
       RETURNING *`,
      [completionStatus, dbUserId, courseId]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    res.status(200).json({
      message: "Completion status updated successfully",
      enrollment: updateResult.rows[0]
    });
  } catch (error) {
    console.error("❌ Update completion status error:", error);
    res.status(500).json({ error: "Failed to update completion status" });
  }
});

app.get("http://localhost:5173/plants/6", async (req,res) => {
 const { userId } = req.auth.sanitizedUser;


})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});