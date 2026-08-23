const express = require("express");

const router = express.Router();

const db = require("../config/db");
const protect = require("../middleware/authMiddleware");


// ========================================
// ENROLL IN COURSE
// ========================================

router.post("/:courseId", protect, async (req, res) => {

  try {

    const { courseId } = req.params;

    const userId = req.user.userId;


    // Check course exists

    const [courses] = await db.query(
      `
      SELECT id, title
      FROM courses
      WHERE id = ?
      LIMIT 1
      `,
      [courseId]
    );


    if (courses.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Course not found",
      });

    }


    // Check already enrolled

    const [existing] = await db.query(
      `
      SELECT id
      FROM enrollments
      WHERE user_id = ?
      AND course_id = ?
      LIMIT 1
      `,
      [userId, courseId]
    );


    if (existing.length > 0) {

      return res.status(409).json({
        success: false,
        message: "Already enrolled in this course",
      });

    }


    // Create enrollment

    const [result] = await db.query(
      `
      INSERT INTO enrollments
      (user_id, course_id, progress)
      VALUES (?, ?, 0)
      `,
      [userId, courseId]
    );


    res.status(201).json({
      success: true,
      message: "Successfully enrolled",
      enrollmentId: result.insertId,
    });


  } catch (error) {

    console.error("Enrollment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to enroll in course",
    });

  }

});


// ========================================
// GET MY ENROLLED COURSES
// ========================================

router.get("/my", protect, async (req, res) => {

  try {

    const userId = req.user.userId;


    const [courses] = await db.query(
      `
      SELECT
        c.id,
        c.title,
        c.slug,
        c.category,
        c.description,
        c.level,
        c.duration,
        c.lessons,
        c.students,
        c.price,
        c.old_price,
        e.progress,
        e.enrolled_at

      FROM enrollments e

      INNER JOIN courses c
        ON e.course_id = c.id

      WHERE e.user_id = ?

      ORDER BY e.enrolled_at DESC
      `,
      [userId]
    );


    res.json({
      success: true,
      courses,
    });


  } catch (error) {

    console.error(
      "My courses fetch error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch enrolled courses",
    });

  }

});


module.exports = router;