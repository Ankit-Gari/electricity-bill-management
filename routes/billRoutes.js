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

router.post("/pay", verifyToken, async (req, res) => {
  const { bill_id, amount, name } = req.body;
  const { id } = req.user;

  try {
    // Insert into bills_paid table
    await db.query("INSERT INTO bills_paid (c_id, name, bill_amt, bill_paid_date) VALUES (?, ?, ?, NOW())", [id, name, amount]);

    // Delete from bills table (optional: simulate payment clearing)
    await db.query("DELETE FROM bills WHERE bill_id = ?", [bill_id]);

    res.status(200).json({ success: true, message: "Bill paid successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Payment failed" });
  }
});


// DELETE /api/bills/:billId - Delete bill by ID (authenticated user)
router.delete("/:billId", verifyToken, deleteBill);

module.exports = router;
