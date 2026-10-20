
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_FROM =
  process.env.EMAIL_FROM || "GenLearning <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, service, budget, message } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof service !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !service.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email, service and message are required.",
      });
    }

    // Save enquiry in the database first
    const [result] = await db.query(
      `INSERT INTO contact_enquiries
       (name, email, phone, service, budget, message)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        email.trim().toLowerCase(),
        typeof phone === "string" ? phone.trim() || null : null,
        service.trim(),
        typeof budget === "string" ? budget.trim() || null : null,
        message.trim(),
      ]
    );

    // Notify admin without losing the saved enquiry on email failure
    if (ADMIN_EMAIL && process.env.RESEND_API_KEY) {
      try {
        const emailResult = await resend.emails.send({
          from: EMAIL_FROM,
          to: ADMIN_EMAIL,
          replyTo: email.trim(),
          subject: `New Contact Enquiry #${result.insertId} - GEN Learning`,
          text: [
            "New contact enquiry received on GEN Learning.",
            "",
            `Enquiry ID: ${result.insertId}`,
            `Name: ${name.trim()}`,
            `Email: ${email.trim()}`,
            `Phone: ${typeof phone === "string" ? phone.trim() || "Not provided" : "Not provided"}`,
            `Service: ${service.trim()}`,
            `Budget: ${typeof budget === "string" ? budget.trim() || "Not provided" : "Not provided"}`,
            "",
            "Message:",
            message.trim(),
          ].join("\n"),
        });

        if (emailResult?.error) {
          console.error("Contact email rejected:", emailResult.error);
        } else {
          console.log("Contact notification sent for enquiry:", result.insertId);
        }
      } catch (emailError) {
        console.error("Contact email failed:", emailError.message);
      }
    } else {
      console.error("Contact email skipped: missing ADMIN_EMAIL or RESEND_API_KEY");
    }

    return res.status(201).json({
      success: true,
      message: "Your enquiry has been submitted successfully.",
      enquiryId: result.insertId,
    });
  } catch (error) {
    console.error("Contact enquiry error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit your enquiry.",
    });
  }
});

module.exports = router;
