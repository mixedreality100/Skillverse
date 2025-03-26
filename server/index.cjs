const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'xrr',
  password: '1234', // Replace with your PostgreSQL password
  port: 5432,
});

// PostgreSQL connection pool for Neon.tech
// const pool = new Pool({
//   connectionString: "postgresql://neondb_owner:npg_fNamjwM23Vud@ep-purple-union-a19yjqw3-pooler.ap-southeast-1.aws.neon.tech/project?sslmode=require",
//   ssl: {
//     rejectUnauthorized: false
//   }
// });



// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Endpoint to add a new course
app.post('/add-course', upload.any(), async (req, res) => {
  try {
    const {
      instructorEmail,
      courseName,
      primaryLanguage,
      level,
      modules,
    } = req.body;

    // Get course image from uploaded files
    let courseImageBuffer = null;
    if (req.files && req.files.length > 0) {
      const courseImageFile = req.files.find(file => file.fieldname === 'courseImage');
      if (courseImageFile) {
        courseImageBuffer = courseImageFile.buffer;
      }
    }

    const courseResult = await pool.query(
      'INSERT INTO courses (instructor_email, course_name, primary_language, level, course_image, number_of_modules) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [instructorEmail, courseName, primaryLanguage, level, courseImageBuffer, JSON.parse(modules).length]
    );

    const courseIdFromDb = courseResult.rows[0].id;
    const parsedModules = JSON.parse(modules);

    for (let i = 0; i < parsedModules.length; i++) {
      const module = parsedModules[i];
      
      // Get module image and GLB file from uploaded files
      let moduleImageBuffer = null;
      let glbFileBuffer = null;
      let part1ImageBuffer = null;
      let part2ImageBuffer = null;
      let part3ImageBuffer = null;
      let part4ImageBuffer = null;

      if (req.files && req.files.length > 0) {
        // Find module image
        const moduleImageFile = req.files.find(file => file.fieldname === `modules[${i}][image]`);
        if (moduleImageFile) {
          moduleImageBuffer = moduleImageFile.buffer;
        }
        
        // Find GLB file
        const glbFile = req.files.find(file => file.fieldname === `modules[${i}][glbFile]`);
        if (glbFile) {
          glbFileBuffer = glbFile.buffer;
        }
        
        // Find part images
        const part1File = req.files.find(file => file.fieldname === `modules[${i}][part1][image]`);
        if (part1File) {
          part1ImageBuffer = part1File.buffer;
        }
        
        const part2File = req.files.find(file => file.fieldname === `modules[${i}][part2][image]`);
        if (part2File) {
          part2ImageBuffer = part2File.buffer;
        }
        
        const part3File = req.files.find(file => file.fieldname === `modules[${i}][part3][image]`);
        if (part3File) {
          part3ImageBuffer = part3File.buffer;
        }
        
        const part4File = req.files.find(file => file.fieldname === `modules[${i}][part4][image]`);
        if (part4File) {
          part4ImageBuffer = part4File.buffer;
        }
      }

      // Update the query to include scientific_name
      const moduleResult = await pool.query(
        `
        INSERT INTO modules (
          course_id,
          module_name,
          scientific_name,
          description,
          module_image,
          glb_file,
          number_of_quiz,
          funfact1,
          funfact2,
          funfact3,
          funfact4,
          part1_name,
          part1_description,
          part1_image,
          part2_name,
          part2_description,
          part2_image,
          part3_name,
          part3_description,
          part3_image,
          part4_name,
          part4_description,
          part4_image,
          benefit1_name,
          benefit1_description,
          benefit2_name,
          benefit2_description,
          benefit3_name,
          benefit3_description,
          benefit4_name,
          benefit4_description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31) RETURNING id
        `,
        [
          courseIdFromDb,
          module.moduleName,
          module.scientificName, // Add the scientific name parameter
          module.description,
          moduleImageBuffer,
          glbFileBuffer,
          module.quiz ? module.quiz.length : 0,
          module.funfact1,
          module.funfact2,
          module.funfact3,
          module.funfact4,
          module.part1.name,
          module.part1.description,
          part1ImageBuffer, // Use the buffer from the files
          module.part2.name,
          module.part2.description,
          part2ImageBuffer, // Use the buffer from the files
          module.part3.name,
          module.part3.description,
          part3ImageBuffer, // Use the buffer from the files
          module.part4.name,
          module.part4.description,
          part4ImageBuffer, // Use the buffer from the files
          module.benefit1.name,
          module.benefit1.description,
          module.benefit2.name,
          module.benefit2.description,
          module.benefit3.name,
          module.benefit3.description,
          module.benefit4.name,
          module.benefit4.description
        ]
      );

      const moduleIdFromDb = moduleResult.rows[0].id;

      // Process quiz questions
      if (module.quiz && module.quiz.length > 0) {
        for (let j = 0; j < module.quiz.length; j++) {
          const question = module.quiz[j];
          if (!['A', 'B', 'C', 'D'].includes(question.correctAnswer)) {
            throw new Error('Invalid correct answer. Please select A, B, C, or D.');
          }
          await pool.query(
            'INSERT INTO quiz_questions (module_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [moduleIdFromDb, question.question, question.optionA, question.optionB, question.optionC, question.optionD, question.correctAnswer]
          );
        }
      }
    }

    res.status(200).send('Course added successfully');
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ message: error.message });
  }
});



app.get('/approved/courses', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, course_name, level, course_image, status FROM courses WHERE status = true');
    const coursesWithImages = result.rows.map(course => {
      if (course.course_image) {
        // Convert BYTEA to Base64
        const base64Image = course.course_image.toString('base64');
        course.course_image = `data:image/png;base64,${base64Image}`;
      } else {
        course.course_image = null; // Handle case where there is no image
      }
      return course;
    });
    res.status(200).json(coursesWithImages);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: error.message });
  }
});

// get get based on the emailid 
app.get('/email/courses', async (req, res) => {
  try {
    const instructorEmail = req.query.instructorEmail; // Get the instructor email from query parameters

    let query;
    let values;

    if (instructorEmail) {
      query = `
        SELECT id, course_name, level, course_image,status
        FROM courses 
        WHERE instructor_email = $1
      `;
      values = [instructorEmail];
    } else {
      query = `
        SELECT id, course_name, level, course_image,status
        FROM courses
      `;
      values = [];
    }

    const result = await pool.query(query, values);

    const coursesWithImages = result.rows.map(course => {
      if (course.course_image) {
        // Convert BYTEA to Base64
        const base64Image = course.course_image.toString('base64');
        course.course_image = `data:image/png;base64,${base64Image}`;
      } else {
        course.course_image = null; // Handle case where there is no image
      }
      return course;
    });

    res.status(200).json(coursesWithImages);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: error.message });
  }
});

// Endpoint to fetch course by course ID
app.get('/courses/:id', async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10);
    const result = await pool.query('SELECT * FROM courses WHERE id = $1', [courseId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const course = result.rows[0];
    if (course.course_image) {
      course.course_image = Buffer.from(course.course_image, 'binary').toString('base64');
    }

    res.status(200).json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: error.message });
  }
});

// Endpoint to fetch modules by course ID
app.get('/modules/:courseId', async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId, 10);
    const result = await pool.query(
      'SELECT * FROM modules WHERE course_id = $1',
      [courseId]
    );

    const modulesWithImages = result.rows.map(module => {
      if (module.module_image) {
        const base64Image = Buffer.from(module.module_image, 'binary').toString('base64');
        module.module_image = `data:image/png;base64,${base64Image}`;
      } else {
        module.module_image = null;
      }
      return module;
    });

    res.status(200).json(modulesWithImages);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ message: error.message });
  }
});


// Endpoint to fetch modules by module ID
app.get("/api/modules/:moduleId", async (req, res) => {
  try {
    const moduleId = Number.parseInt(req.params.moduleId, 10);

    // Check if moduleId is a valid number
    if (isNaN(moduleId)) {
      return res.status(400).json({
        message: "Invalid module ID. Please provide a valid number.",
      });
    }

    const result = await pool.query("SELECT * FROM modules WHERE id = $1", [moduleId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Module not found" });
    }

    const modulesWithImages = result.rows.map((module) => {
      // Convert all image fields from binary to base64
      const imageFields = ["module_image", "part1_image", "part2_image", "part3_image", "part4_image"];

      // Process each image field
      imageFields.forEach((field) => {
        if (module[field]) {
          try {
            const base64Image = Buffer.from(module[field], "binary").toString("base64");
            module[field] = `data:image/png;base64,${base64Image}`;
          } catch (error) {
            console.error(`Error converting ${field} to base64:`, error);
            module[field] = null;
          }
        } else {
          module[field] = null;
        }
      });

      // Process GLB file if present
      if (module.glb_file) {
        try {
          const base64GLB = Buffer.from(module.glb_file, "binary").toString("base64");
          module.glb_file_base64 = `data:model/gltf-binary;base64,${base64GLB}`;
        } catch (error) {
          console.error("Error converting GLB file to base64:", error);
          module.glb_file_base64 = null;
        }
      } else {
        module.glb_file_base64 = null;
      }

      return module;
    });

    res.status(200).json(modulesWithImages);
  } catch (error) {
    console.error("Error fetching modules:", error);
    res.status(500).json({ message: error.message });
  }
});

//quiz
app.get('/api/modules/:moduleId/quiz', async (req, res) => {
  const { moduleId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM quiz_questions WHERE module_id = $1',
      [parseInt(moduleId, 10)]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    res.status(500).json({ message: 'Internal Server Error', details: error.message });
  }
});


// Endpoint to delete a course by ID
app.delete('/delete-course/:id', async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10);

    // Step 0: Delete all course enrollments associated with this course
    await pool.query('DELETE FROM course_enrollment WHERE course_id = $1', [courseId]);

    // Step 1: Delete all quizzes associated with the modules of this course
    await pool.query('DELETE FROM quiz_questions WHERE module_id IN (SELECT id FROM modules WHERE course_id = $1)', [courseId]);

    // Step 2: Delete all module completions associated with the modules of this course
    await pool.query('DELETE FROM module_completion WHERE module_id IN (SELECT id FROM modules WHERE course_id = $1)', [courseId]);

    // Step 3: Delete all course statistics associated with this course
    await pool.query('DELETE FROM course_statistics WHERE course_id = $1', [courseId]);

    // Step 4: Delete all feedback associated with this course
    await pool.query('DELETE FROM feedback WHERE course_id = $1', [courseId]);

    // Step 5: Delete all rewards associated with this course
    await pool.query('DELETE FROM reward WHERE course_id = $1', [courseId]);

    // Step 6: Delete all modules associated with this course
    await pool.query('DELETE FROM modules WHERE course_id = $1', [courseId]);

    // Step 7: Delete the course
    await pool.query('DELETE FROM courses WHERE id = $1', [courseId]);

    res.status(200).send('Course deleted successfully');
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: error.message });
  }
});

// Endpoint to delete a module by ID
app.delete('/delete-module/:id', async (req, res) => {
  try {
    const moduleId = parseInt(req.params.id, 10);

    // Step 0: Delete all module completions associated with this module
    await pool.query('DELETE FROM module_completion WHERE module_id = $1', [moduleId]);

    // Step 1: Delete all quizzes associated with this module
    await pool.query('DELETE FROM quiz_questions WHERE module_id = $1', [moduleId]);

    // Step 2: Delete the module
    await pool.query('DELETE FROM modules WHERE id = $1', [moduleId]);

    res.status(200).send('Module deleted successfully');
  } catch (error) {
    console.error('Error deleting module:', error);
    res.status(500).json({ message: error.message });
  }
});

// Endpoint to search courses
app.get('/courses/search', async (req, res) => {
  try {
    const keyword = `%${req.query.keyword}%`;
    const query = `
      SELECT DISTINCT c.*
      FROM courses c
      LEFT JOIN modules m ON c.id = m.course_id
      WHERE c.course_name ILIKE $1
         OR c.level ILIKE $1
         OR m.module_title ILIKE $1
         OR m.description ILIKE $1
    `;
    const params = [keyword];

    const result = await pool.query(query, params);
    const coursesWithImages = result.rows.map(course => {
      if (course.course_image) {
        const base64Image = Buffer.from(course.course_image, 'binary').toString('base64');
        course.course_image = `data:image/png;base64,${base64Image}`;
      } else {
        course.course_image = null;
      }
      return course;
    });

    res.status(200).json(coursesWithImages);
  } catch (error) {
    console.error('Error searching courses:', error);
    res.status(500).json({ message: error.message });
  }
});

// Endpoint to fetch courses with filtering and sorting
app.get('/api/courses', async (req, res) => {
  try {
    let query = 'SELECT * FROM courses WHERE status = true'; // Start with the status condition
    const params = [];
    let whereClauseAdded = false;

    if (req.query.keyword) {
      const keyword = `%${req.query.keyword}%`;
      query += (whereClauseAdded ? ' AND' : ' AND') + ' (course_name ILIKE $1 OR level ILIKE $1)';
      params.push(keyword);
      whereClauseAdded = true;
    }

    if (req.query.level) {
      const levelParamIndex = whereClauseAdded ? params.length + 1 : 1;
      query += (whereClauseAdded ? ' AND' : ' AND') + ` level ILIKE $${levelParamIndex}`;
      params.push(`%${req.query.level}%`);
      whereClauseAdded = true;
    }

    if (req.query.sortBy) {
      let order = req.query.sortOrder === 'desc' ? 'DESC' : 'ASC';

      if (req.query.sortBy === 'name') {
        query += ` ORDER BY course_name ${order}`;
      } else if (req.query.sortBy === 'level') {
        query += ` ORDER BY level ${order}`;
      }
    }

    console.log('Final Query:', query);
    console.log('Parameters:', params);

    const result = await pool.query(query, params);
    const coursesWithImages = result.rows.map(course => {
      if (course.course_image) {
        const base64Image = Buffer.from(course.course_image, 'binary').toString('base64');
        course.course_image = `data:image/png;base64,${base64Image}`;
      } else {
        course.course_image = null;
      }
      return course;
    });

    res.status(200).json(coursesWithImages);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: error.message });
  }
});


app.get('/api/modules/next/:courseId/:moduleId', async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    console.log('Fetching next module for course:', courseId, 'and module:', moduleId);

    // Validate input
    if (!courseId || !moduleId) {
      return res.status(400).json({ error: 'Missing courseId or moduleId' });
    }

    // Convert to integers
    const courseIdInt = parseInt(courseId, 10);
    const moduleIdInt = parseInt(moduleId, 10);

    if (isNaN(courseIdInt)) {
      return res.status(400).json({ error: 'Invalid courseId' });
    }

    if (isNaN(moduleIdInt)) {
      return res.status(400).json({ error: 'Invalid moduleId' });
    }

    const result = await pool.query(
      'SELECT id FROM modules WHERE course_id = $1 AND id > $2 ORDER BY id ASC LIMIT 1',
      [courseIdInt, moduleIdInt]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Next module not found' });
    }

    res.json({ nextModuleId: result.rows[0].id });
  } catch (error) {
    console.error('Error fetching next module ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// app.post('/api/submit-quiz', async (req, res) => {
//   try {
//     const { userId, moduleId, answers } = req.body;

//     // Check if the record already exists
//     const checkQuery = `
//       SELECT id
//       FROM module_completion
//       WHERE user_id = $1 AND module_id = $2;
//     `;
//     const checkResult = await pool.query(checkQuery, [userId, moduleId]);

//     let result;
//     if (checkResult.rows.length > 0) {
//       // Record exists, update it
//       const updateQuery = `
//         UPDATE module_completion
//         SET completion_date = NOW()
//         WHERE user_id = $1 AND module_id = $2
//         RETURNING id;
//       `;
//       result = await pool.query(updateQuery, [userId, moduleId]);
//     } else {
//       // Record does not exist, insert it
//       const insertQuery = `
//         INSERT INTO module_completion (user_id, module_id, completion_date)
//         VALUES ($1, $2, NOW())
//         RETURNING id;
//       `;
//       result = await pool.query(insertQuery, [userId, moduleId]);
//     }

//     // If the insertion or update was successful, return the ID
//     if (result.rows.length > 0) {
//       res.status(200).json({ success: true, nextModuleId: result.rows[0].id });
//     } else {
//       res.status(200).json({ success: true, nextModuleId: null });
//     }
//   } catch (error) {
//     console.error('Error submitting quiz:', error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

app.post('/api/submit-quiz', async (req, res) => {
  try {
    const { userId, moduleId, courseId, answers } = req.body;

    // Check if the record already exists
    const checkQuery = `
      SELECT id
      FROM module_completion
      WHERE user_id = $1 AND module_id = $2;
    `;
    const checkResult = await pool.query(checkQuery, [userId, moduleId]);

    let moduleCompletionId;
    if (checkResult.rows.length > 0) {
      // Record exists, update it
      const updateQuery = `
        UPDATE module_completion
        SET completion_date = NOW()
        WHERE user_id = $1 AND module_id = $2
        RETURNING id;
      `;
      const result = await pool.query(updateQuery, [userId, moduleId]);
      moduleCompletionId = result.rows[0].id;
    } else {
      // Record does not exist, insert it without specifying id
      // Let PostgreSQL assign the next value from the sequence
      const insertQuery = `
        INSERT INTO module_completion (user_id, module_id, completion_date)
        VALUES ($1, $2, NOW())
        RETURNING id;
      `;
      const result = await pool.query(insertQuery, [userId, moduleId]);
      moduleCompletionId = result.rows[0].id;
    }

    // Calculate the total points earned
    const pointsPerModule = 10;
    const totalPointsQuery = `
      SELECT COUNT(*) AS total_modules_completed
      FROM module_completion
      WHERE user_id = $1;
    `;
    const totalPointsResult = await pool.query(totalPointsQuery, [userId]);

    const totalModulesCompleted = totalPointsResult.rows[0].total_modules_completed;
    const totalPointsEarned = totalModulesCompleted * pointsPerModule;

    // Check if a reward already exists for this user and course
    const checkRewardQuery = `
      SELECT id
      FROM reward
      WHERE user_id = $1 AND course_id = $2;
    `;
    const checkRewardResult = await pool.query(checkRewardQuery, [userId, courseId]);

    let rewardId;
    if (checkRewardResult.rows.length > 0) {
      // Update existing reward record
      const updateRewardQuery = `
        UPDATE reward
        SET points_earned = $3, reward_date = NOW()
        WHERE user_id = $1 AND course_id = $2
        RETURNING id;
      `;
      const updateRewardResult = await pool.query(updateRewardQuery, [userId, courseId, totalPointsEarned]);
      rewardId = updateRewardResult.rows[0].id;
    } else {
      // Insert new reward record without specifying id
      const insertRewardQuery = `
        INSERT INTO reward (user_id, course_id, points_earned, reward_date)
        VALUES ($1, $2, $3, NOW())
        RETURNING id;
      `;
      const insertRewardResult = await pool.query(insertRewardQuery, [userId, courseId, totalPointsEarned]);
      rewardId = insertRewardResult.rows[0].id;
    }

    // Return the IDs of the module completion and reward records
    res.status(200).json({ 
      success: true, 
      moduleCompletionId, 
      rewardId,
      pointsEarned: totalPointsEarned
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/module-completion/:userId/:moduleId', async (req, res) => {
  try {
    const { userId, moduleId } = req.params;
    const result = await pool.query(
      'SELECT COUNT(*) AS completed FROM module_completion WHERE user_id = $1 AND module_id = $2',
      [userId, moduleId]
    );

    res.json({ completed: result.rows[0].completed > 0 });
  } catch (error) {
    console.error('Error checking module completion:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/submit-feedback', async (req, res) => {
  try {
    const { userId, courseId, feedback } = req.body;

    await pool.query(
      'INSERT INTO feedback (user_id, course_id, feedback_text, feedback_date) VALUES ($1, $2, $3, CURRENT_DATE)',
      [userId, courseId, feedback]
    );

    res.json({ success: true, redirectUrl: `/learner-dashboard?courseId=${courseId}` });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/complete-course', async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    console.log('Received course completion request:', { userId, courseId });

    // Update the course_enrollment table to mark the course as completed
    const updateEnrollmentResult = await pool.query(
      'UPDATE course_enrollment SET is_completed = true, completion_date = CURRENT_DATE WHERE user_id = $1 AND course_id = $2 RETURNING *',
      [userId, courseId]
    );
    console.log('Course enrollment update result:', updateEnrollmentResult.rows);

    if (updateEnrollmentResult.rows.length > 0) {
      console.log('Course marked as completed.');
      res.json({ success: true, message: 'Course marked as completed.' });
    } else {
      console.log('No course enrollment record found to update.');
      res.json({ success: false, message: 'No course enrollment record found to update.' });
    }
  } catch (error) {
    console.error('Error completing course:', error);
    res.status(500).json({ message: error.message });
  }
});

// Endpoint to fetch enrolled course details for a user
app.get('/api/enrolled-courses/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);

    // Step 1: Get the course IDs the user is enrolled in
    const enrollmentResult = await pool.query(
      'SELECT course_id FROM course_enrollment WHERE user_id = $1',
      [userId]
    );

    if (enrollmentResult.rows.length === 0) {
      return res.status(404).json({ message: 'No enrolled courses found for this user' });
    }

    const courseIds = enrollmentResult.rows.map(row => row.course_id);

    // Step 2: Fetch details of the enrolled courses
    const coursesResult = await pool.query(
      'SELECT id, course_name, level, course_image FROM courses WHERE id = ANY($1)',
      [courseIds]
    );

    const coursesWithImages = coursesResult.rows.map(course => {
      if (course.course_image) {
        // Convert BYTEA to Base64
        const base64Image = course.course_image.toString('base64');
        course.course_image = `data:image/png;base64,${base64Image}`;
      } else {
        course.course_image = null; // Handle case where there is no image
      }
      return course;
    });

    res.status(200).json(coursesWithImages);
  } catch (error) {
    console.error('Error fetching enrolled course details:', error);
    res.status(500).json({ message: error.message });
  }
});
//progress
app.get('/module-completion/:userId/:courseId', async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    // Fetch total modules for the course
    const totalModulesResult = await pool.query(
      'SELECT COUNT(*) AS total FROM modules WHERE course_id = $1',
      [courseId]
    );
    const totalModules = totalModulesResult.rows[0].total;

    // Fetch completed modules for the user and course
    const completedModulesResult = await pool.query(
      'SELECT COUNT(*) AS completed FROM module_completion WHERE user_id = $1 AND module_id IN (SELECT id FROM modules WHERE course_id = $2)',
      [userId, courseId]
    );
    const completedModules = completedModulesResult.rows[0].completed;

    res.status(200).json({ completed: completedModules, total: totalModules });
  } catch (error) {
    console.error('Error fetching module completion:', error);
    res.status(500).json({ message: error.message });
  }
});
//progress
app.get('/last-completed-module/:userId/:courseId', async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    // Fetch the last completed module ID for the user in this course
    const lastCompletedModuleResult = await pool.query(
      `SELECT MAX(m.id) AS last_completed_module_id 
       FROM module_completion mc
       JOIN modules m ON mc.module_id = m.id
       WHERE mc.user_id = $1 AND m.course_id = $2`,
      [userId, courseId]
    );

    const lastCompletedModuleId = lastCompletedModuleResult.rows[0].last_completed_module_id;

    res.status(200).json({ 
      lastCompletedModuleId: lastCompletedModuleId || null 
    });
  } catch (error) {
    console.error('Error fetching last completed module:', error);
    res.status(500).json({ message: error.message });
  }
});
//progress
app.get('/course-modules/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;

    // Fetch the first and last module IDs for the course
    const moduleRangeResult = await pool.query(
      `SELECT 
        MIN(id) AS first_module_id, 
        MAX(id) AS last_module_id 
      FROM modules 
      WHERE course_id = $1`,
      [courseId]
    );

    const { first_module_id, last_module_id } = moduleRangeResult.rows[0];

    res.status(200).json({ 
      firstModuleId: first_module_id, 
      lastModuleId: last_module_id 
    });
  } catch (error) {
    console.error('Error fetching course modules:', error);
    res.status(500).json({ message: error.message });
  }
});

// New endpoint to fetch progress for all enrolled courses
// New endpoint to fetch progress for all enrolled courses
app.get('/api/user-progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    // Fetch all enrolled courses for the user
    const enrolledCoursesResult = await pool.query(
      'SELECT course_id FROM course_enrollment WHERE user_id = $1',
      [userId]
    );

    const enrolledCourses = enrolledCoursesResult.rows;

    if (enrolledCourses.length === 0) {
      return res.status(200).json([]); // No courses enrolled
    }

    // Fetch progress for each enrolled course
    const progressPromises = enrolledCourses.map(async (enrollment) => {
      const courseId = enrollment.course_id;

      // Validate courseId
      if (isNaN(courseId)) {
        throw new Error('Invalid courseId');
      }

      // Fetch total modules for the course
      const totalModulesResult = await pool.query(
        'SELECT COUNT(*) AS total FROM modules WHERE course_id = $1',
        [courseId]
      );
      const totalModules = totalModulesResult.rows[0].total;

      // Fetch completed modules for the user and course
      const completedModulesResult = await pool.query(
        'SELECT COUNT(*) AS completed FROM module_completion WHERE user_id = $1 AND module_id IN (SELECT id FROM modules WHERE course_id = $2)',
        [userId, courseId]
      );
      const completedModules = completedModulesResult.rows[0].completed;

      return {
        course_id: courseId,
        completed: completedModules,
        total: totalModules,
      };
    });

    const progressData = await Promise.all(progressPromises);

    console.log('Progress Data:', progressData); // Debugging log

    res.status(200).json(progressData);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ message: error.message });
  }
});

// Updated endpoint to check next incomplete module
app.get('/api/next-incomplete-module/:userId/:courseId', async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    
    // Get all modules for the course in order
    const allModulesResult = await pool.query(
      'SELECT id, module_name FROM modules WHERE course_id = $1 ORDER BY id ASC',
      [courseId]
    );
    
    if (allModulesResult.rows.length === 0) {
      return res.status(404).json({ message: 'No modules found for this course' });
    }
    
    // Get completed modules for the user
    const completedModulesResult = await pool.query(
      'SELECT module_id FROM module_completion WHERE user_id = $1 AND module_id IN (SELECT id FROM modules WHERE course_id = $2)',
      [userId, courseId]
    );
    
    // Extract IDs of completed modules
    const completedModuleIds = completedModulesResult.rows.map(row => row.module_id);
    
    // Find the first incomplete module
    const nextIncompleteModule = allModulesResult.rows.find(module => !completedModuleIds.includes(module.id));
    
    if (nextIncompleteModule) {
      return res.status(200).json({ 
        nextModuleId: nextIncompleteModule.id,
        moduleName: nextIncompleteModule.module_name,
        isFirstModule: nextIncompleteModule.id === allModulesResult.rows[0].id
      });
    } else {
      // All modules completed
      return res.status(200).json({ 
        completed: true, 
        message: 'All modules in this course have been completed' 
      });
    }
  } catch (error) {
    console.error('Error finding next incomplete module:', error);
    res.status(500).json({ message: error.message });
  }
});

// Endpoint to update a course
app.post("/update-course", upload.any(), async (req, res) => {
  try {
    console.log("==== COURSE UPDATE REQUEST RECEIVED ====");
    const { courseId, instructorEmail, courseName, primaryLanguage, level, modules } = req.body;
    
    // Log all file names that were received
    console.log("Files received:", req.files ? req.files.map(f => ({name: f.fieldname, size: f.size})) : "No files");
    
    // Log request body keys (excluding large values)
    console.log("Request body keys:", Object.keys(req.body));
    
    // Validate course ID
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    // STEP 1: Get course image from uploaded files
    let courseImageBuffer = null;
    if (req.files && req.files.length > 0) {
      const courseImageFile = req.files.find((file) => file.fieldname === "courseImage");
      if (courseImageFile) {
        courseImageBuffer = courseImageFile.buffer;
        console.log("Course image found:", courseImageFile.fieldname, courseImageFile.size, "bytes");
      } else {
        console.log("No course image found in the request");
      }
    }

    // Start a transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      console.log("Database transaction started");

      // STEP 2: Update course details
      if (courseImageBuffer) {
        // Update with new image
        console.log("Updating course with new image");
        await client.query(
          "UPDATE courses SET instructor_email = $1, course_name = $2, primary_language = $3, level = $4, course_image = $5, number_of_modules = $6 WHERE id = $7",
          [
            instructorEmail,
            courseName,
            primaryLanguage,
            level,
            courseImageBuffer,
            JSON.parse(modules).length,
            courseId,
          ],
        );
      } else {
        // Update without changing the image
        console.log("Updating course without changing image");
        await client.query(
          "UPDATE courses SET instructor_email = $1, course_name = $2, primary_language = $3, level = $4, number_of_modules = $5 WHERE id = $6",
          [instructorEmail, courseName, primaryLanguage, level, JSON.parse(modules).length, courseId],
        );
      }

      // STEP 3: Process modules
      const parsedModules = JSON.parse(modules);
      console.log(`Processing ${parsedModules.length} modules`);

      // Process each module
      for (let i = 0; i < parsedModules.length; i++) {
        const module = parsedModules[i];
        console.log(`\nProcessing module ${i}: ${module.moduleName}`);

        // STEP 4: Get module files for this module
        let moduleImageBuffer = null;
        let glbFileBuffer = null;
        let part1ImageBuffer = null;
        let part2ImageBuffer = null;
        let part3ImageBuffer = null;
        let part4ImageBuffer = null;

        if (req.files && req.files.length > 0) {
          // We're using simplified field names here
          const moduleImageFile = req.files.find((file) => file.fieldname === `moduleImage_${i}`);
          if (moduleImageFile) {
            moduleImageBuffer = moduleImageFile.buffer;
            console.log(`Found module image: ${moduleImageFile.fieldname}, ${moduleImageFile.size} bytes`);
          } else {
            console.log(`No module image found for module ${i}`);
          }

          const glbFile = req.files.find((file) => file.fieldname === `moduleGlb_${i}`);
          if (glbFile) {
            glbFileBuffer = glbFile.buffer;
            console.log(`Found GLB file: ${glbFile.fieldname}, ${glbFile.size} bytes`);
          } else {
            console.log(`No GLB file found for module ${i}`);
          }

          // Find part images
          for (let j = 1; j <= 4; j++) {
            const partFile = req.files.find((file) => file.fieldname === `modulePart${j}_${i}`);
            if (partFile) {
              console.log(`Found part${j} image: ${partFile.fieldname}, ${partFile.size} bytes`);
              if (j === 1) part1ImageBuffer = partFile.buffer;
              if (j === 2) part2ImageBuffer = partFile.buffer;
              if (j === 3) part3ImageBuffer = partFile.buffer;
              if (j === 4) part4ImageBuffer = partFile.buffer;
            } else {
              console.log(`No part${j} image found for module ${i}`);
            }
          }
        }

        // STEP 5: Update or create module
        if (module.id) {
          // This is an existing module, update it
          console.log(`Updating existing module with ID: ${module.id}`);

          // Build the update query dynamically based on which files were uploaded
          let updateQuery = `
            UPDATE modules SET
              module_name = $1,
              scientific_name = $2,
              description = $3,
              number_of_quiz = $4,
              funfact1 = $5,
              funfact2 = $6,
              funfact3 = $7,
              funfact4 = $8,
              part1_name = $9,
              part1_description = $10,
              part2_name = $11,
              part2_description = $12,
              part3_name = $13,
              part3_description = $14,
              part4_name = $15,
              part4_description = $16,
              benefit1_name = $17,
              benefit1_description = $18,
              benefit2_name = $19,
              benefit2_description = $20,
              benefit3_name = $21,
              benefit3_description = $22,
              benefit4_name = $23,
              benefit4_description = $24
          `;

          // Prepare parameters array
          const params = [
            module.moduleName,
            module.scientificName,
            module.description,
            module.quiz ? module.quiz.length : 0,
            module.funfact1 || null,
            module.funfact2 || null,
            module.funfact3 || null,
            module.funfact4 || null,
            module.part1 ? module.part1.name : null,
            module.part1 ? module.part1.description : null,
            module.part2 ? module.part2.name : null,
            module.part2 ? module.part2.description : null,
            module.part3 ? module.part3.name : null,
            module.part3 ? module.part3.description : null,
            module.part4 ? module.part4.name : null,
            module.part4 ? module.part4.description : null,
            module.benefit1 ? module.benefit1.name : null,
            module.benefit1 ? module.benefit1.description : null, 
            module.benefit2 ? module.benefit2.name : null,
            module.benefit2 ? module.benefit2.description : null,
            module.benefit3 ? module.benefit3.name : null,
            module.benefit3 ? module.benefit3.description : null,
            module.benefit4 ? module.benefit4.name : null,
            module.benefit4 ? module.benefit4.description : null,
          ];

          let paramIndex = 25;

          // Add image fields if they were uploaded
          if (moduleImageBuffer) {
            updateQuery += `, module_image = $${paramIndex}`;
            params.push(moduleImageBuffer);
            paramIndex++;
            console.log("Including module image in update query");
          }

          if (glbFileBuffer) {
            updateQuery += `, glb_file = $${paramIndex}`;
            params.push(glbFileBuffer);
            paramIndex++;
            console.log("Including GLB file in update query");
          }

          if (part1ImageBuffer) {
            updateQuery += `, part1_image = $${paramIndex}`;
            params.push(part1ImageBuffer);
            paramIndex++;
            console.log("Including part1 image in update query");
          }

          if (part2ImageBuffer) {
            updateQuery += `, part2_image = $${paramIndex}`;
            params.push(part2ImageBuffer);
            paramIndex++;
            console.log("Including part2 image in update query");
          }

          if (part3ImageBuffer) {
            updateQuery += `, part3_image = $${paramIndex}`;
            params.push(part3ImageBuffer);
            paramIndex++;
            console.log("Including part3 image in update query");
          }

          if (part4ImageBuffer) {
            updateQuery += `, part4_image = $${paramIndex}`;
            params.push(part4ImageBuffer);
            paramIndex++;
            console.log("Including part4 image in update query");
          }

          updateQuery += ` WHERE id = $${paramIndex}`;
          params.push(module.id);

          await client.query(updateQuery, params);
          console.log(`Updated module ${module.id} successfully`);

          // Delete existing quiz questions for this module
          await client.query("DELETE FROM quiz_questions WHERE module_id = $1", [module.id]);
          console.log(`Deleted existing quiz questions for module ${module.id}`);

          // Add new quiz questions
          if (module.quiz && module.quiz.length > 0) {
            console.log(`Adding ${module.quiz.length} quiz questions for module ${module.id}`);
            for (const question of module.quiz) {
              if (!["A", "B", "C", "D"].includes(question.correctAnswer)) {
                throw new Error("Invalid correct answer. Please select A, B, C, or D.");
              }
              await client.query(
                "INSERT INTO quiz_questions (module_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES ($1, $2, $3, $4, $5, $6, $7)",
                [
                  module.id,
                  question.question,
                  question.optionA,
                  question.optionB,
                  question.optionC,
                  question.optionD,
                  question.correctAnswer,
                ],
              );
            }
          }
        } else {
          // This is a new module, insert it
          console.log("Creating new module");
          
          // Log all the parts going into the insert
          console.log("Module insert parameters check:");
          console.log("- Module image:", moduleImageBuffer ? "Present" : "Missing");
          console.log("- GLB file:", glbFileBuffer ? "Present" : "Missing");
          console.log("- Part1 image:", part1ImageBuffer ? "Present" : "Missing");
          console.log("- Part2 image:", part2ImageBuffer ? "Present" : "Missing");
          console.log("- Part3 image:", part3ImageBuffer ? "Present" : "Missing");
          console.log("- Part4 image:", part4ImageBuffer ? "Present" : "Missing");
          
          const moduleResult = await client.query(
            `
            INSERT INTO modules (
              course_id,
              module_name,
              scientific_name,
              description,
              module_image,
              glb_file,
              number_of_quiz,
              funfact1,
              funfact2,
              funfact3,
              funfact4,
              part1_name,
              part1_description,
              part1_image,
              part2_name,
              part2_description,
              part2_image,
              part3_name,
              part3_description,
              part3_image,
              part4_name,
              part4_description,
              part4_image,
              benefit1_name,
              benefit1_description,
              benefit2_name,
              benefit2_description,
              benefit3_name,
              benefit3_description,
              benefit4_name,
              benefit4_description
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31) RETURNING id
            `,
            [
              courseId,
              module.moduleName,
              module.scientificName,
              module.description,
              moduleImageBuffer,  // This should contain the module image buffer
              glbFileBuffer,      // This should contain the GLB file buffer
              module.quiz ? module.quiz.length : 0,
              module.funfact1 || null,
              module.funfact2 || null,
              module.funfact3 || null,
              module.funfact4 || null,
              module.part1 ? module.part1.name : null,
              module.part1 ? module.part1.description : null,
              part1ImageBuffer,   // This should contain the part1 image buffer
              module.part2 ? module.part2.name : null,
              module.part2 ? module.part2.description : null,
              part2ImageBuffer,   // This should contain the part2 image buffer
              module.part3 ? module.part3.name : null,
              module.part3 ? module.part3.description : null,
              part3ImageBuffer,   // This should contain the part3 image buffer
              module.part4 ? module.part4.name : null,
              module.part4 ? module.part4.description : null,
              part4ImageBuffer,   // This should contain the part4 image buffer
              module.benefit1 ? module.benefit1.name : null,
              module.benefit1 ? module.benefit1.description : null,
              module.benefit2 ? module.benefit2.name : null,
              module.benefit2 ? module.benefit2.description : null,
              module.benefit3 ? module.benefit3.name : null,
              module.benefit3 ? module.benefit3.description : null,
              module.benefit4 ? module.benefit4.name : null,
              module.benefit4 ? module.benefit4.description : null,
            ],
          );

          const moduleIdFromDb = moduleResult.rows[0].id;
          console.log(`Created new module with ID: ${moduleIdFromDb}`);

          // Process quiz questions
          if (module.quiz && module.quiz.length > 0) {
            console.log(`Adding ${module.quiz.length} quiz questions for new module ${moduleIdFromDb}`);
            for (const question of module.quiz) {
              if (!["A", "B", "C", "D"].includes(question.correctAnswer)) {
                throw new Error("Invalid correct answer. Please select A, B, C, or D.");
              }
              await client.query(
                "INSERT INTO quiz_questions (module_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES ($1, $2, $3, $4, $5, $6, $7)",
                [
                  moduleIdFromDb,
                  question.question,
                  question.optionA,
                  question.optionB,
                  question.optionC,
                  question.optionD,
                  question.correctAnswer,
                ],
              );
            }
          }
        }
      }

      // Commit the transaction
      await client.query("COMMIT");
      console.log("Transaction committed successfully");
      res.status(200).send("Course updated successfully");
    } catch (error) {
      // Rollback in case of error
      await client.query("ROLLBACK");
      console.error("Transaction rolled back due to error:", error.message);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: error.message });
  }
});

//for top reward
app.get('/api/top-rewards', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.name, r.points_earned
      FROM reward r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.points_earned DESC
      LIMIT 3;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add this route to your Express server

app.get("/api/instructor-courses", async (req, res) => {
  const instructorEmail = req.query.email;
  
  if (!instructorEmail) {
    return res.status(400).json({ message: "Instructor email is required" });
  }
  
  try {
    const client = await pool.connect();
    try {
      // Query to get courses and enrollment counts for a specific instructor
      const result = await client.query(`
        SELECT 
          c.id,
          c.course_name,
          c.primary_language,
          c.level,
          COUNT(ce.id) AS enrolled_students
        FROM 
          courses c
        LEFT JOIN 
          course_enrollment ce ON c.id = ce.course_id
        WHERE 
          c.instructor_email = $1
        GROUP BY 
          c.id, c.course_name, c.primary_language, c.level
        ORDER BY 
          c.id
      `, [instructorEmail]);
      
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching instructor courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});


// API endpoint to handle login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM adminLogin WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// admin dashboard  to count total number of useres
app.get('/api/users/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) AS total_users FROM users');
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({ message: error.message });
  }
});
//to count no. of active course
app.get('/api/courses/active', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.course_name, c.instructor_email, u.name as instructor_name 
      FROM courses c
      LEFT JOIN users u ON c.instructor_email = u.email
      WHERE c.status = true
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching active courses:', error);
    res.status(500).json({ message: error.message });
  }
});
//to count no. of un approved course
app.get('/api/courses/unapproved', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.course_name, c.instructor_email, u.name as instructor_name 
      FROM courses c
      LEFT JOIN users u ON c.instructor_email = u.email
      WHERE c.status = false
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching unapproved courses:', error);
    res.status(500).json({ message: error.message });
  }
});

//total no of instructor 
app.get('/api/users/instructors/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) AS total_instructors FROM users WHERE is_content_creator = true');
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching instructor count:', error);
    res.status(500).json({ message: error.message });
  }
});

//total no of learner 
app.get('/api/users/learners/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) AS total_learners FROM users WHERE is_content_creator = false');
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching instructor count:', error);
    res.status(500).json({ message: error.message });
  }
});

// all other information about the admin dashboard
app.get('/api/courses/enrollment', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ce.course_id, COUNT(*) AS total_students
      FROM course_enrollment ce
      JOIN courses c ON ce.course_id = c.id
      WHERE c.status = true
      GROUP BY ce.course_id
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching course enrollment:', error);
    res.status(500).json({ message: error.message });
  }
});

// api of admin usermanagement to display user information
app.get('/admin/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, is_content_creator FROM users');
    const users = result.rows.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.is_content_creator ? 'Instructor' : 'Learner'
    }));
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message });
  }
});

// api of admin usermanagement to delete user information
app.delete('/admin/api/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    // Delete related records from course_enrollment table
    await pool.query('DELETE FROM course_enrollment WHERE user_id = $1', [userId]);

    // Delete the user from the users table
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);

    if (result.rows.length > 0) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: error.message });
  }
});

// Endpoint to fetch all courses for admin course management

app.get('/courses', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.course_name, c.level, c.instructor_email, c.course_image, c.status, u.name AS instructor_name,
      (SELECT COUNT(*) FROM course_enrollment ce WHERE ce.course_id = c.id) AS total_students
      FROM courses c
      LEFT JOIN users u ON c.instructor_email = u.email
    `);

    const coursesWithImages = result.rows.map(course => {
      if (course.course_image) {
        // Convert BYTEA to Base64
        const base64Image = course.course_image.toString('base64');
        course.course_image = `data:image/png;base64,${base64Image}`;
      } else {
        course.course_image = null; // Handle case where there is no image
      }
      return course;
    });

    res.status(200).json(coursesWithImages);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/courses/:id/approve', async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10);
    // Make sure the status is properly converted to a boolean
    const status = req.body.status === true;

    console.log(`Updating course ${courseId} status to: ${status}`);
    
    await pool.query('UPDATE courses SET status = $1 WHERE id = $2', [status, courseId]);

    res.status(200).json({ message: 'Course status updated successfully' });
  } catch (error) {
    console.error('Error updating course status:', error);
    res.status(500).json({ message: error.message });
  }
});

//id 
// Endpoint to get user ID by email
app.get('/api/user-id', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const result = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = result.rows[0].id;
    console.log(`Fetched user ID for email ${email}: ${userId}`);
    res.json({ userId });
  } catch (error) {
    console.error('Error fetching user ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/course-first-module/:courseId', async (req, res) => {
  try {
    const courseId = req.params.courseId;
    // Query your database to find the first module for this course
    const firstModule = await db.modules.findFirst({
      where: { courseId: courseId },
      orderBy: { moduleNumber: 'asc' }
    });

    res.json({ 
      firstModuleId: firstModule ? firstModule.id : null 
    });
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch first module' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});