
// passport.use(new GoogleStrategy({
    // clientID: process.env.GOOGLE_CLIENT_ID,
    // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // callbackURL: "http://localhost:3000/auth/google/callback",
    
    // },
    // (accessToken, refreshToken, profile, done) => {
    //     return done(null, profile);
    // }));
    
// app.get("/", (req,res)=>{
//     res.send("<a href='/auth/google'> login with google </a>");
// })
// app.get("/auth/google",

//     passport.authenticate("google", {scope: ["profile","email"]})
// );

// app.get('/auth/google/callback', 
//     passport.authenticate('google', { failureRedirect: '/' }), 
//     async (req, res) => {
//         try {
//             const profile = req.user;
            
//             // Check if user exists
//             const existingUser = await db.query(
//                 "SELECT * FROM users WHERE google_id = $1 OR email = $2",
//                 [profile.id, profile.emails[0].value]
//             );

//             if (existingUser.rows.length === 0) {
//                 // Create new user with a default password for Google users
//                 await db.query(
//                     `INSERT INTO users 
//                     (google_id, email, name, picture_url, password) 
//                     VALUES ($1, $2, $3, $4, $5)`,
//                     [
//                         profile.id,
//                         profile.emails[0].value,
//                         profile.displayName,
//                         profile.photos[0]?.value || null,
//                         'GOOGLE_OAUTH_USER' // or any other marker you prefer
//                     ]
//                 );
//             } else {
//                 // Update existing user's Google information
//                 await db.query(
//                     `UPDATE users 
//                     SET google_id = $1, 
//                         name = $2, 
//                         picture_url = $3 
//                     WHERE email = $4`,
//                     [
//                         profile.id,
//                         profile.displayName,
//                         profile.photos[0]?.value || null,
//                         profile.emails[0].value
//                     ]
//                 );
//             }

//             res.redirect('http://localhost:5173/');
//         } catch (error) {
//             console.error('Error saving user:', error);
//             res.redirect('/');
//         }
//     }
// );

// app.get("/profile", (req,res)=>{
// res.send(`Welcome {req.user.displayName}`);
//  });
 
//  app.get("/logout", (req, res, next) => {
//     req.logout((err) => {
//         if (err) {
//             return next(err);
//         }
//         // Redirect to Google's logout endpoint
//         const redirectUri = 'https://accounts.google.com/Logout';
//         res.redirect(redirectUri);
//     });
//  });

//  app.post("/logout", (req, res) => {
//     req.logout((err) => {
//         if (err) {
//             return res.status(500).json({ message: "Logout failed" });
//         }

//         // Destroy the session
//         req.session.destroy((err) => {
//             if (err) {
//                 return res.status(500).json({ message: "Session destruction failed" });
//             }

//             // Clear the connect.sid cookie
//             res.clearCookie('connect.sid'); // Ensure the cookie name matches your session cookie name
//             res.json({ message: "Logout successful" });
//         });
//     });
// });


// // Add this endpoint to handle user registration
// app.post('/signup', async (req, res) => {
//     const { email, password, firstName, lastName, role } = req.body;
    
//     try {
//         // Check if user already exists
//         const checkUser = await db.query(
//             'SELECT * FROM users WHERE email = $1',
//             [email]
//         );

//         if (checkUser.rows.length > 0) {
//             return res.status(400).json({ message: 'User already exists with this email' });
//         }

//         // Create new user
//         const fullName = `${firstName} ${lastName}`;
//         const result = await db.query(
//             'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *',
//             [email, password, fullName]
//         );

//         res.status(201).json({
//             message: 'User created successfully',
//             user: result.rows[0]
//         });

//     } catch (error) {
//         console.error('Error during signup:', error);
//         res.status(500).json({ message: 'Server error during signup' });
//     }
// });

// app.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
//         const user = result.rows[0];

//         if (user && user.password === password) {
//             return res.json({ message: "Login successful" });
//         } else {
//             return res.status(401).json({ message: "Invalid email or password" });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Server error" });
//     }
// });



// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

// //doesn't work
// app.post('/forgot-password', async (req, res) => {
//     const { email } = req.body;
//     console.log('Received forgot password request for:', email);
//     try {
//       // Check if the email exists and get the password
//       const result = await db.query('SELECT password FROM users WHERE email = $1', [email]);
      
//       if (result.rows.length === 0) {
//         return res.status(400).json({ message: 'No user found with that email' });
//       }
  
//       const userPassword = result.rows[0].password;
  
//       // Send the email with the password
//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: 'Your Password Recovery',
//         text: `Your password is: ${userPassword}`,
//         // You can also use HTML format:
//         html: `
//           <h2>Password Recovery</h2>
//           <p>Your password is: <strong>${userPassword}</strong></p>
//           <p>Please change your password after logging in for security purposes.</p>
//         `
//       };
  
//       await transporter.sendMail(mailOptions);
  
//       res.json({ message: 'Password has been sent to your email' });
//     } catch (error) {
//       console.error('Error processing forgot password request:', error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   });