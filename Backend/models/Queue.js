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
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: false, // Optional for walk-in patients
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
    notes: { type: String },
    estimatedWaitTime: { type: Number }, // in minutes
    checkedInAt: { type: Date, default: Date.now },
    calledAt: { type: Date },
    completedAt: { type: Date },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual fields for frontend compatibility
queueSchema.virtual('patientId').get(function() {
  return this.patient;
});

queueSchema.virtual('doctorId').get(function() {
  return this.doctor;
});

queueSchema.virtual('appointmentId').get(function() {
  return this.appointment;
});

module.exports = mongoose.model("Queue", queueSchema);
