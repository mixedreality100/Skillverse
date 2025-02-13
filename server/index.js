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
  database: 'xr',
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
      courseImage,
      modules,
    } = req.body;

    let courseImageBuffer = null;
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        if (req.files[i].fieldname === 'courseImage') {
          courseImageBuffer = req.files[i].buffer;
        }
      }
    }

    const courseResult = await pool.query(
      'INSERT INTO courses (instructor_email, course_name, primary_language, level, course_image, number_of_modules) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [instructorEmail, courseName, primaryLanguage, level, courseImageBuffer, modules.length]
    );

    const courseIdFromDb = courseResult.rows[0].id;

    const parsedModules = JSON.parse(modules);

    for (let i = 0; i < parsedModules.length; i++) {
      const module = parsedModules[i];
      let moduleImageBuffer = null;
      let glbFileBuffer = null;

      if (req.files && req.files.length > 0) {
        for (let j = 0; j < req.files.length; j++) {
          if (req.files[j].fieldname === `modules[${i}][image]`) {
            moduleImageBuffer = req.files[j].buffer;
          } else if (req.files[j].fieldname === `modules[${i}][glbFile]`) {
            glbFileBuffer = req.files[j].buffer;
          }
        }
      }

      // Store importantParts and benefits as strings
      const importantPartsString = module.importantParts || '';
      const benefitsString = module.benefits || '';

      const moduleResult = await pool.query(
        'INSERT INTO modules (course_id, module_name, specific_name, description, more_information, important_parts, benefits, module_image, glb_file, number_of_quiz) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
        [courseIdFromDb, module.moduleName, module.specificName, module.description, module.moreInformation, importantPartsString, benefitsString, moduleImageBuffer, glbFileBuffer, module.quiz.length]
      );

      const moduleIdFromDb = moduleResult.rows[0].id;

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

    res.status(200).send('Course added successfully');
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ message: error.message });
  }
});

// Endpoint to fetch all courses

app.get('/courses', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, course_name, level, course_image FROM courses');
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


// Endpoint to fetch all courses
app.get('/courses', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, course_name, primary_language, level, course_image FROM courses');
    const coursesWithImages = result.rows.map(course => {
      if (course.course_image) {
        const base64Image = course.course_image.toString('base64');
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
app.get('/api/modules/:moduleId', async (req, res) => {
  try {
    const moduleId = parseInt(req.params.moduleId, 10);
    const result = await pool.query(
      'SELECT * FROM modules WHERE id = $1',
      [moduleId]
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

// Endpoint to delete a course by ID
app.delete('/delete-course/:id', async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10);

    // Step 1: Delete all quizzes associated with the modules of this course
    await pool.query('DELETE FROM quiz_questions WHERE module_id IN (SELECT id FROM modules WHERE course_id = $1)', [courseId]);

    // Step 2: Delete all modules associated with this course
    await pool.query('DELETE FROM modules WHERE course_id = $1', [courseId]);

    // Step 3: Delete the course
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
    let query = 'SELECT * FROM courses';
    const params = [];
    let whereClauseAdded = false;

    if (req.query.keyword) {
      const keyword = `%${req.query.keyword}%`;
      query += (whereClauseAdded ? ' AND' : ' WHERE') + ' (course_name ILIKE $1 OR level ILIKE $1)';
      params.push(keyword);
      whereClauseAdded = true;
    }

    if (req.query.level) {
      const levelParamIndex = whereClauseAdded ? params.length + 1 : 1;
      query += (whereClauseAdded ? ' AND' : ' WHERE') + ` level ILIKE $${levelParamIndex}`;
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



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});