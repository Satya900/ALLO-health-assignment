const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorController");

// protected CRUD routes
router.post("/", protect, addDoctor);
router.get("/", protect, getAllDoctors);
router.get("/:id", protect, getDoctorById);
router.put("/:id", protect, updateDoctor);
router.delete("/:id", protect, deleteDoctor);

module.exports = router;
