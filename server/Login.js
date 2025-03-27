import express from "express";
import cors from "cors";
import db from "./db/db.js";
import dotenv from 'dotenv';
import { clerkClient, requireAuth } from '@clerk/express';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai"; // [[2]][[5]]


// ES module path fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Secure API key [[5]]
const app = express();
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());


const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash", // Updated to latest version
  systemInstruction:  `
  You are a specialized AI assistant for Skillverse. 
  You MUST ONLY answer questions about: 
  - Medicinal plants 
  - Human Anatomy 
  - The Solar System. 
  REFUSE to discuss ANY other topics. 
  If a query is unrelated, respond with: "I cannot assist with that topic."`,
  generationConfig: {
    temperature: 0.1, // 
    topP: 0.9, // Diverse but focused responses
    topK: 40, // Broad but controlled token selection
    maxOutputTokens: 1048, // Increased token limit
  },
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    }
  ]
});

// Gemini API route
app.post("/api/gemini", async (req, res) => {
  const { message, context } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    // Initialize model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction:  `
  You are a specialized AI assistant for Skillverse. 
  You MUST ONLY answer questions about: 
  - Medicinal plants 
  - Human Anatomy 
  - The Solar System. 
  - Normal greetings from the user and small talks.
  - About skillverse site
  REFUSE to discuss ANY other topics. 
  If a query is unrelated, respond with: "I cannot assist with that topic.
  About Skillverse - Skillverse has ar/vr models to make the learning experience better with music and other functionalities.
  Navigate the Site:
        On desktop, you’ll find a navigation bar at the top with buttons like "Courses," "Explore," "About Us," and "Leaderboard." Click "Courses" to scroll down to a list of available courses, or click "Explore" to browse all courses in detail.
        On mobile, tap the hamburger icon (three horizontal lines) in the top-right corner to open a sidebar. From there, you can tap the same options ("Courses," "Explore," "About Us," "Leaderboard") to navigate. Tap the "X" to close the sidebar.
    Log In or Sign Up:
        If you’re not logged in, you’ll see a "Login" button in the top-right corner (or in the mobile sidebar). Click it to sign up or log in using your email, Google, or other options. We use a secure system to handle this for you.
        Once logged in, the "Login" button changes to a profile button showing your picture or initials. Click it to log out if needed.
    Get Support: Look for a gold-colored bot button in the bottom-right corner. Click it to open a chat window where you can ask questions (like "How do I enroll in a course?") and get instant help.
    Connect with Us: Scroll to the footer to find social media buttons (Instagram, Twitter, Facebook, Pinterest). Click any of them to visit our pages and stay updated.

2. Exploring and Enrolling in Courses (For Everyone)

Before logging in, you can browse courses to get a feel for what we offer:

    View Courses on the Landing Page: Scroll down to the "Courses" section, where you’ll see cards with course names, levels (e.g., beginner, advanced), and images. Hover over a card to see it scale up slightly for a nice effect.
    Go to the Explore Page: Click the "Explore" button in the navigation bar (or sidebar on mobile) to visit the course exploration page. Here, you’ll see a grid of all available courses with more details like the instructor’s name. Click a course card to see its overview, including a description and module list.
    Enroll in a Course: If you’re logged in as a learner, you’ll see an "Enroll" button on the course overview page. Click it to join the course, and it’ll appear on your learner dashboard.

3. Learning as a Learner

Once you’re logged in as a learner, where your learning journey begins:

    Check Your Dashboard: The learner dashboard shows your enrolled courses, progress, and certificates. It has a tabbed layout—switch between tabs to see:
        Enrolled Courses: A list of courses you’ve joined, with a progress bar showing how much you’ve completed.
        Certificates: Courses you’ve finished, with a button to download a certificate as a PDF.
        
    Start Learning:
        Click an enrolled course to go to its module page. Here, you’ll find the course content, like text, images, and interactive elements.
        Enjoy a lo-fi music track playing in the background to help you focus. Use the music control button (or toggle switch) to adjust the volume or turn it off.
        Look for a VR button to view a 3D model (e.g., an aloe plant). Click it to open the model in a fullscreen view, where you can rotate, zoom, or switch to VR mode for an immersive experience.
    Take Quizzes:
        At the end of a module, you might find a quiz. Answer the questions and submit your responses.
        A modal will pop up with your score. If you pass, you’ll see a fun confetti animation to celebrate! If it’s the last module, you can also click a "Give Feedback" button to rate the course and leave comments.
    Track Progress: Back on your dashboard, the progress bar for the course updates as you complete modules, helping you see how far you’ve come.
    
  "`,
      generationConfig: {
        temperature: 0.3,
        topP: 0.9,
        maxOutputTokens: 1048,
        
        
      }
    });

    // Send message
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    // Return response
    res.json({ 
      response: text,
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // Detailed error response
    res.status(500).json({ 
      error: "Gemini API request failed",
      details: error.message,
    });
  }
});

// Clerk middleware configuration
app.use(requireAuth({
  secretKey: process.env.CLERK_SECRET_KEY,
}));



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
    
    res.status(200).json({ message: "User saved successfully" });
  } catch (error) {
    console.error("❌ Error saving user:", error);
    res.status(500).json({ error: "Failed to save user", details: error.message });
  }
});

// Route to become a content creator
app.post("/api/becomeContentCreator", async (req, res) => {
  try {
    const userId = req.auth.userId;
    
    await db.query(
      "UPDATE users SET is_content_creator = true WHERE clerk_user_id = $1",
      [userId]
    );
    
    res.status(200).json({
      message: "You are now a Content Creator",
      success: true
    });
  } catch (error) {
    console.error("❌ Database error:", error);
    res.status(500).json({
      error: "Database error",
      details: error.message
    });
  }
});

// Check if user is a content creator
app.post("/api/checkContentCreator", async (req, res) => {
  try {
    const userId = req.auth.userId;
    
    const user = await db.query(
      "SELECT is_content_creator FROM users WHERE clerk_user_id = $1",
      [userId]
    );
    
    if (user.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
        isContentCreator: false
      });
    }
    
    res.status(200).json({
      isContentCreator: user.rows[0].is_content_creator
    });
  } catch (error) {
    console.error("❌ Database error:", error);
    res.status(500).json({
      error: "Database error",
      details: error.message
    });
  }
});

// Get user progress
app.get("/api/userProgress", requireAuth, async (req, res) => {
  try {
    const userId = req.auth.userId;
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
    const userId = req.auth.userId;
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
    const userId = req.auth.userId;
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

// Get user's enrolled courses with more details
app.get('/api/my-courses', async (req, res) => {
  try {
    const userId = req.auth.userId;
    
    // Get the database user_id
    const userResult = await db.query(
      "SELECT id FROM users WHERE clerk_user_id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const dbUserId = userResult.rows[0].id;
    
    // Updated query to match your courses table structure
    const result = await db.query(
      `SELECT 
        ce.id as enrollment_id,
        ce.course_id,
        ce.enrollment_date,
        ce.is_completed,
        ce.completion_date,
        c.course_name,
        c.instructor_email,
        c.primary_language,
        c.level,
        c.course_image,
        c.number_of_modules
       FROM course_enrollment ce
       JOIN courses c ON ce.course_id = c.id
       WHERE ce.user_id = $1`,
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
    const userId = req.auth.userId;
    
    // Get the database user_id first
    const userResult = await db.query(
      "SELECT id FROM users WHERE clerk_user_id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const dbUserId = userResult.rows[0].id;
    
    // Update completion status with completion date
    const currentDate = new Date().toISOString().split('T')[0];
    const updateResult = await db.query(
      `UPDATE course_enrollment 
       SET is_completed = TRUE, 
           completion_date = $1 
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [currentDate, enrollmentId, dbUserId]
    );
    
    if (updateResult.rows.length === 0) {
      return res.status(404).json({ error: "Enrollment not found or unauthorized" });
    }
    
    res.json({ 
      success: true, 
      message: "Course marked as completed",
      enrollment: updateResult.rows[0]
    });
  } catch (error) {
    console.error("Error completing course:", error);
    res.status(500).json({ error: "Failed to mark course as completed" });
  }
});

// Check if certificate is available
app.get('/api/certificate/:enrollmentId/check', async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const userId = req.auth.userId;
    
    // Get the database user_id first
    const userResult = await db.query(
      "SELECT id FROM users WHERE clerk_user_id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const dbUserId = userResult.rows[0].id;

    // Updated query to match your courses table structure
    const result = await db.query(
      `SELECT ce.is_completed, c.course_name, c.instructor_email
       FROM course_enrollment ce
       JOIN courses c ON ce.course_id = c.id
       WHERE ce.id = $1 AND ce.user_id = $2`,
      [enrollmentId, dbUserId]
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
    // Add validation for enrollmentId
    const enrollmentId = parseInt(req.params.enrollmentId);
    if (!enrollmentId || isNaN(enrollmentId)) {
      return res.status(400).json({ error: "Invalid enrollment ID" });
    }

    const userId = req.auth.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    
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
      `SELECT ce.course_id, ce.enrollment_date, ce.is_completed, 
              c.course_name, c.instructor_email, c.primary_language, c.level
       FROM course_enrollment ce
       JOIN courses c ON ce.course_id = c.id
       WHERE ce.id = $1 AND ce.user_id = $2`,
      [enrollmentId, dbUserId] // Now using validated enrollmentId
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
    const fileName = `certificate-${dbUserId}-${req.params.enrollmentId}.pdf`;
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
       .text(enrollment.course_name, {
         align: 'center'
       })
       .moveDown(0.5);
    
    // Add instructor email instead of name
    doc.fontSize(18)
       .font('Helvetica')
       .text(`Instructor: ${enrollment.instructor_email}`, {
         align: 'center'
       })
       .moveDown(0.5);
    
    // Add additional course details
    doc.fontSize(14)
       .text(`Language: ${enrollment.primary_language}`, {
         align: 'center'
       })
       .moveDown(0.5)
       .text(`Level: ${enrollment.level}`, {
         align: 'center'
       })
       .moveDown(1);
    
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