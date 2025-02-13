const express = require("express");
const cors = require("cors");
const db = require("./db/db.cjs");
require('dotenv').config();
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173', // Allow requests from this origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));
app.use(express.json());

// Initialize Clerk middleware
const clerkMiddleware = ClerkExpressWithAuth({
    secretKey: process.env.CLERK_SECRET_KEY
});

app.post("/api/saveUser", clerkMiddleware, async (req, res) => {
    console.log("🔸 Received request with Clerk ID:", req.auth?.userId);
    console.log("🔸 Request body:", req.body);
    
    if (!req.auth?.userId) {
        console.error("❌ No Clerk ID found in request");
        return res.status(401).json({ error: "No Clerk ID found" });
    }

    try {
        const existingUser = await db.query(
            "SELECT * FROM users WHERE clerk_user_id = $1", 
            [req.auth.userId]
        );
        console.log("🔸 Database query result:", existingUser.rows);

        if (existingUser.rows.length === 0) {
            console.log("🔸 Creating new user");
            await db.query(
                `INSERT INTO users (
                    clerk_user_id, email, name, picture_url, is_content_creator
                ) VALUES ($1, $2, $3, $4, $5)`,
                [
                    req.auth.userId,
                    req.body.email,
                    `${req.body.firstName} ${req.body.lastName}`,
                    req.body.imageUrl,
                    false
                ]
            );
        } else {
            console.log("🔸 Updating existing user");
            await db.query(
                `UPDATE users 
                 SET email = $2, name = $3, picture_url = $4
                 WHERE clerk_user_id = $1`,
                [
                    req.auth.userId,
                    req.body.email,
                    `${req.body.firstName} ${req.body.lastName}`,
                    req.body.imageUrl
                ]
            );
        }

        res.status(200).json({ 
            message: "User saved successfully",
            userId: req.auth.userId
        });
    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`👉 Accepting requests from: ${corsOptions.origin}`);
});