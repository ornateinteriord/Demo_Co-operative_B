const express = require("express");
const router = express.Router();
const {
    createPayment,
    getPayments,
    getPaymentById,
    updatePayment,
    deletePayment
} = require("../controllers/Admin/Banking/payments");
const Authenticated = require("../middlewares/auth");
const authorizeRoles = require("../middlewares/authorizeRole");


// Payments endpoints
router.post("/payments", Authenticated, authorizeRoles(["ADMIN", "ADMIN_01", "AGENT"]), createPayment);
router.get("/payments", Authenticated, authorizeRoles(["ADMIN", "ADMIN_01", "AGENT"]), getPayments);
router.get("/payments/:paymentId", Authenticated, authorizeRoles(["ADMIN", "ADMIN_01", "AGENT"]), getPaymentById);
router.put("/payments/:paymentId", Authenticated, authorizeRoles(["ADMIN", "ADMIN_01", "AGENT"]), updatePayment);
router.delete("/payments/:paymentId", Authenticated, authorizeRoles(["ADMIN", "ADMIN_01", "AGENT"]), deletePayment);

module.exports = router;
