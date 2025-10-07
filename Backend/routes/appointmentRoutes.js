const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  bookAppointment,
  getAllAppointments,
  updateAppointment,
  cancelAppointment,
  completeAppointment,
} = require("../controllers/appointmentController");

router.post("/", protect, bookAppointment);
router.get("/", protect, getAllAppointments);
router.put("/:id", protect, updateAppointment);
router.patch("/:id/cancel", protect, cancelAppointment);
router.patch("/:id/complete", protect, completeAppointment);

module.exports = router;
