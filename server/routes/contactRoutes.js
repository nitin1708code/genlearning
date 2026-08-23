const express = require("express");

const router = express.Router();

const db = require("../config/db");


// ========================================
// SUBMIT CONTACT ENQUIRY
// ========================================

router.post("/", async (req, res) => {

  try {

    const {
      name,
      email,
      phone,
      service,
      budget,
      message,
    } = req.body;


    // Basic validation

    if (
      !name ||
      !email ||
      !service ||
      !message
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Name, email, service and message are required.",
      });

    }


    // Insert enquiry

    const [result] = await db.query(
      `
      INSERT INTO contact_enquiries
      (
        name,
        email,
        phone,
        service,
        budget,
        message
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        name.trim(),
        email.trim().toLowerCase(),
        phone?.trim() || null,
        service,
        budget || null,
        message.trim(),
      ]
    );


    res.status(201).json({

      success: true,

      message:
        "Your enquiry has been submitted successfully.",

      enquiryId: result.insertId,

    });


  } catch (error) {

    console.error(
      "Contact enquiry error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Unable to submit your enquiry.",

    });

  }

});


module.exports = router;