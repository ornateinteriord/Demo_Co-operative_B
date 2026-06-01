const express = require("express");
const router = express.Router();
const {
    createReceipt,
    getReceipts,
    getReceiptById,
    updateReceipt,
    deleteReceipt
} = require("../controllers/Admin/Banking/receipts");
const Authenticated = require("../middlewares/auth");
const authorizeRoles = require("../middlewares/authorizeRole");


// Receipts endpoints
router.post("/receipts", Authenticated, authorizeRoles(["ADMIN", "ADMIN_01", "AGENT"]), createReceipt);
router.get("/receipts", Authenticated, authorizeRoles(["ADMIN", "ADMIN_01", "AGENT"]), getReceipts);
router.get("/receipts/:receiptId", Authenticated, authorizeRoles(["ADMIN", "ADMIN_01", "AGENT"]), getReceiptById);
router.put("/receipts/:receiptId", Authenticated, authorizeRoles(["ADMIN", "ADMIN_01", "AGENT"]), updateReceipt);
router.delete("/receipts/:receiptId", Authenticated, authorizeRoles(["ADMIN", "ADMIN_01", "AGENT"]), deleteReceipt);

module.exports = router;
