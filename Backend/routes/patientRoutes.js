const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient
} = require("../controllers/patientController");

router.post("/", protect, addPatient);
router.get("/", protect, getAllPatients);
router.get("/:id", protect, getPatientById);
router.put("/:id", protect, updatePatient);
router.delete("/:id", protect, deletePatient);

module.exports = router;
