const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addToQueue,
  getQueue,
  getQueueItem,
  updateQueueStatus,
  updateQueuePriority,
  removeFromQueue,
  getTodayQueue,
  getQueueStats,
  callNextPatient,
} = require("../controllers/queueController");

// Main queue routes
router.post("/", protect, addToQueue);
router.get("/", protect, getQueue);
router.get("/today", protect, getTodayQueue);
router.get("/stats", protect, getQueueStats);
router.get("/:id", protect, getQueueItem);
router.put("/:id/status", protect, updateQueueStatus);
router.put("/:id/priority", protect, updateQueuePriority);
router.put("/call-next/:doctorId", protect, callNextPatient);
router.delete("/:id", protect, removeFromQueue);

module.exports = router;
