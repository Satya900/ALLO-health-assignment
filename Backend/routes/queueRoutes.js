const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addToQueue,
  getQueue,
  updateQueueStatus,
  removeFromQueue,
} = require("../controllers/queueController");

router.post("/", protect, addToQueue);
router.get("/", protect, getQueue);
router.patch("/:id", protect, updateQueueStatus);
router.delete("/:id", protect, removeFromQueue);

module.exports = router;
