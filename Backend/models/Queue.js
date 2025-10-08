const mongoose = require("mongoose");

const queueSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    queueNumber: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Waiting", "With Doctor", "Completed"],
      default: "Waiting",
    },
    priority: {
      type: String,
      enum: ["Normal", "Urgent"],
      default: "Normal",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Queue", queueSchema);
