// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/authMiddleware");
const db = require("../config/db");

// GET /api/admin/dashboard - Dashboard statistics
router.get("/dashboard", verifyToken, isAdmin, async (req, res) => {
  // These queries assume your tables have the following columns:
  // user_login: c_id
  // bills: used for total bills, and bills_paid from a separate table bills_paid
  // Adjust the table names/columns as needed.
  const [users] = await db.query("SELECT COUNT(*) AS total_users FROM user_login");
  const [bills] = await db.query("SELECT COUNT(*) AS total_bills FROM bills");
  const [paid] = await db.query("SELECT COUNT(*) AS bills_paid FROM bills_paid");

  res.status(200).json({
    success: true,
    data: {
      total_users: users[0].total_users,
      total_bills: bills[0].total_bills,
      bills_paid: paid[0].bills_paid,
    },
  });
});

// GET /api/admin/users - Get all registered users
router.get("/users", verifyToken, isAdmin, async (req, res) => {
  const [users] = await db.query("SELECT * FROM user_login");
  res.status(200).json({ success: true, data: users });
});

// GET /api/admin/messages - Get all inbox messages
router.get("/messages", verifyToken, isAdmin, async (req, res) => {
  // Assuming you store inbox messages in a table called "inbox"
  const [messages] = await db.query("SELECT * FROM inbox");
  res.status(200).json({ success: true, data: messages });
});

// DELETE /api/admin/user/:id - Delete a user by id
router.delete("/user/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM user_login WHERE c_id = ?", [id]);
  res.status(200).json({ success: true, message: "User deleted successfully" });
});

module.exports = router;
