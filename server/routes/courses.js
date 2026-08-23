const express = require("express");

const router = express.Router();

const db = require("../config/db");


// ========================================
// GET ALL COURSES
// ========================================

router.get("/", async (req, res) => {

  try {

    const [courses] = await db.query(`
      SELECT
        id,
        title,
        slug,
        category,
        description,
        level,
        duration,
        lessons,
        students,
        price,
        old_price,
        created_at
      FROM courses
      ORDER BY id ASC
    `);


    res.json({
      success: true,
      courses: courses,
    });

  } catch (error) {

    console.error("Courses fetch error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });

  }

});


// ========================================
// GET SINGLE COURSE BY SLUG
// ========================================

router.get("/:slug", async (req, res) => {

  try {

    const { slug } = req.params;


    const [courses] = await db.query(
      `
      SELECT
        id,
        title,
        slug,
        category,
        description,
        level,
        duration,
        lessons,
        students,
        price,
        old_price,
        created_at
      FROM courses
      WHERE slug = ?
      LIMIT 1
      `,
      [slug]
    );


    if (courses.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Course not found",
      });

    }


    res.json({
      success: true,
      course: courses[0],
    });

  } catch (error) {

    console.error("Single course fetch error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
    });

  }

});


module.exports = router;