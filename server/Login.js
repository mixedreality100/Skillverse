import express from "express";
import cors from "cors";
import db from "./db/db.js";
import dotenv from 'dotenv';
import { clerkClient ,requireAuth } from '@clerk/express';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module path fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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




app.post("/api/saveUser", async (req, res) => {
  try {
    const userId = req.auth.userId;
    
    // Use clerkClient to get complete user details
    const user = await clerkClient.users.getUser(userId);
    
    // Extract properly formatted user data
    const userData = {
      clerkUserId: userId,
      email: user.emailAddresses[0]?.emailAddress || `no-email-${userId}@example.com`,
      firstName: user.firstName || 'Anonymous',
      lastName: user.lastName || '',
      imageUrl: user.imageUrl || '/default-avatar.png'
    };
    
    const fullName = `${userData.firstName} ${userData.lastName}`.trim();

    const existingUser = await db.query(
      "SELECT * FROM users WHERE clerk_user_id = $1",
      [userData.clerkUserId]
    );

    if (existingUser.rows.length === 0) {
      await db.query(
        `INSERT INTO users (clerk_user_id, email, name, picture_url, is_content_creator, progress)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          userData.clerkUserId,
          userData.email,
          fullName || 'Anonymous User',
          userData.imageUrl,
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
          userData.clerkUserId,
          userData.email,
          fullName,
          userData.imageUrl
        ]
      );
    }

    res.status(200).json({
      message: "User saved successfully",
      userId: userData.clerkUserId
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

// Create certificates directory if it doesn't exist
const certificatesDir = path.join(__dirname, 'certificates');
if (!fs.existsSync(certificatesDir)) {
  fs.mkdirSync(certificatesDir, { recursive: true });
}

// Get user's enrolled courses
app.get('/api/my-courses', async (req, res) => {
  try {
    const { userId } = req.auth.sanitizedUser;
    
    // Get the database user_id
    const userResult = await db.query(
      "SELECT id FROM users WHERE clerk_user_id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const dbUserId = userResult.rows[0].id;
    
    const result = await db.query(
      `SELECT id, course_id, enrollment_date, is_completed, completion_date
       FROM course_enrollment
       WHERE user_id = $1`,
      [dbUserId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ error: "Failed to fetch enrolled courses" });
  }
});

// Mark course as completed
app.post('/api/complete-course/:enrollmentId', async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const userId = req.auth.sanitizedUser.userId;
    
    // Verify the enrollment belongs to the user
    const enrollment = await db.query(
      "SELECT * FROM course_enrollment WHERE id = $1 AND user_id = $2",
      [enrollmentId, userId]
    );
    
    if (enrollment.rows.length === 0) {
      return res.status(404).json({ error: "Enrollment not found or unauthorized" });
    }
    
    // Update the completion status
    await db.query(
      "UPDATE course_enrollment SET is_completed = TRUE WHERE id = $1",
      [enrollmentId]
    );
    
    res.json({ success: true, message: "Course marked as completed" });
  } catch (error) {
    console.error("Error completing course:", error);
    res.status(500).json({ error: "Failed to mark course as completed" });
  }
});

// Check if certificate is available
app.get('/api/certificate/:enrollmentId/check', async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const userId = req.auth.sanitizedUser.userId;
    
    const result = await db.query(
      `SELECT ce.is_completed, c.title, c.instructor_name 
       FROM course_enrollment ce
       JOIN courses c ON ce.course_id = c.id
       WHERE ce.id = $1 AND ce.user_id = $2`,
      [enrollmentId, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Enrollment not found or unauthorized" });
    }
    
    const { is_completed } = result.rows[0];
    
    res.json({ 
      available: is_completed,
      message: is_completed ? 
        "Certificate is available for download" : 
        "Complete the course to access your certificate"
    });
  } catch (error) {
    console.error("Error checking certificate availability:", error);
    res.status(500).json({ error: "Failed to check certificate availability" });
  }
});

// Generate and download certificate
app.get('/api/certificate/:enrollmentId/download', async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { userId } = req.auth.sanitizedUser;
    
    // Get the database user_id
    const userResult = await db.query(
      "SELECT id, name FROM users WHERE clerk_user_id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const dbUserId = userResult.rows[0].id;
    const userName = userResult.rows[0].name;
    
    // Check if the enrollment exists and is completed
    const enrollmentResult = await db.query(
      `SELECT course_id, enrollment_date, is_completed
       FROM course_enrollment
       WHERE id = $1 AND user_id = $2`,
      [enrollmentId, dbUserId]
    );
    
    if (enrollmentResult.rows.length === 0) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    const enrollment = enrollmentResult.rows[0];
    
    if (!enrollment.is_completed) {
      return res.status(403).json({ 
        error: "Course must be completed before downloading certificate" 
      });
    }
    
    // Create filename for certificate
    const fileName = `certificate-${dbUserId}-${enrollmentId}.pdf`;
    const filePath = path.join(certificatesDir, fileName);
    
    // Generate PDF certificate
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
      margin: 50
    });
    
    // Pipe PDF to writable stream
    doc.pipe(fs.createWriteStream(filePath));
    
    // Certificate styling and content
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f6f6f6');
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
       .stroke('#333333');
    
    // Certificate header
    doc.fontSize(30)
       .font('Helvetica-Bold')
       .fillColor('#333333')
       .text('CERTIFICATE OF COMPLETION', {
         align: 'center',
         valign: 'center'
       })
       .moveDown(1);
    
    // Certificate body
    doc.fontSize(18)
       .font('Helvetica')
       .text(`This is to certify that`, {
         align: 'center'
       })
       .moveDown(0.5);
    
    doc.fontSize(26)
       .font('Helvetica-Bold')
       .text(userName, {
         align: 'center'
       })
       .moveDown(0.5);
    
    doc.fontSize(18)
       .font('Helvetica')
       .text(`has successfully completed the course`, {
         align: 'center'
       })
       .moveDown(0.5);
    
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .text(`Course ID: ${enrollment.course_id}`, {
         align: 'center'
       })
       .moveDown(0.5);
    
    // Date and signature
    const currentDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    
    doc.fontSize(14)
       .text(`Date: ${currentDate}`, {
         align: 'center'
       })
       .moveDown(2);
    
    // Signature line
    const signatureX = doc.page.width / 2;
    const signatureY = doc.y;
    doc.moveTo(signatureX - 100, signatureY)
       .lineTo(signatureX + 100, signatureY)
       .stroke();
    
    doc.fontSize(14)
       .text('Instructor Signature', signatureX - 60, signatureY + 10);
    
    // Finalize the PDF
    doc.end();
    
    // Set appropriate headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    
    // Wait a moment for the file to be fully written
    setTimeout(() => {
      // Send the file
      res.download(filePath, fileName, (err) => {
        if (err) {
          console.error("Error sending certificate:", err);
          return res.status(500).json({ error: "Failed to download certificate" });
        }
        
        // Clean up file after sending
        setTimeout(() => {
          fs.unlink(filePath, (err) => {
            if (err) console.error("Error removing certificate file:", err);
          });
        }, 1000);
      });
    }, 100);
    
  } catch (error) {
    console.error("Error generating certificate:", error);
    res.status(500).json({ error: "Failed to generate certificate" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});