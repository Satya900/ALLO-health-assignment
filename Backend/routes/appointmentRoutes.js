const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  bookAppointment,
  getAllAppointments,
  getAppointment,
  updateAppointment,
  cancelAppointment,
  completeAppointment,
  deleteAppointment,
  getTodaysAppointments,
  getUpcomingAppointments,
} = require("../controllers/appointmentController");

// Main appointment routes
router.post("/", protect, bookAppointment);
router.get("/", protect, getAllAppointments);
router.get("/today", protect, getTodaysAppointments);
router.get("/upcoming", protect, getUpcomingAppointments);
router.get("/:id", protect, getAppointment);
router.put("/:id", protect, updateAppointment);
router.put("/:id/cancel", protect, cancelAppointment);
router.put("/:id/complete", protect, completeAppointment);
router.delete("/:id", protect, deleteAppointment);

module.exports = router;
