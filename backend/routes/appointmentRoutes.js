const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    createAppointment,
    getAppointments,
    getPatientHistory,
    updateAppointment,
    getAvailableSlots,
    deleteAppointment,
} = require("../controllers/appointmentController");

// Patient routes
router.post("/book", createAppointment);
router.get("/slots/:date", getAvailableSlots);

// Doctor routes
router.get("/all", authMiddleware, getAppointments);
router.get("/history/:phoneNumber", authMiddleware, getPatientHistory);
router.put("/:id", authMiddleware, updateAppointment);
router.delete("/:id", authMiddleware, deleteAppointment);

module.exports = router;