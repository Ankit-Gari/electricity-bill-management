// routes/billRoutes.js

const express = require("express");
const {
  getAllBills,
  getUserBills,
  addBill,
  deleteBill,
} = require("../controllers/billController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/bills/ - Get all bills (public or admin-level access)
router.get("/", getAllBills);

// GET /api/bills/user - Get bills of logged-in user
router.get("/user", verifyToken, getUserBills);

// POST /api/bills/ - Add a bill (authenticated user)
router.post("/", verifyToken, addBill);

// DELETE /api/bills/:billId - Delete bill by ID (authenticated user)
router.delete("/:billId", verifyToken, deleteBill);

module.exports = router;
