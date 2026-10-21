
const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
  const secret = process.env.KEEPALIVE_SECRET;

  if (
    !secret ||
    req.get("x-keepalive-secret") !== secret
  ) {
    return res.status(401).json({ ok: false });
  }

  try {
    await pool.query("SELECT 1");

    return res.status(200).json({
      ok: true,
      database: "reachable",
    });
  } catch (error) {
    console.error("Keep-alive check failed:", error.message);

    return res.status(503).json({
      ok: false,
      database: "unavailable",
    });
  }
});

module.exports = router;
