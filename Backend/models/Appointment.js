const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    date: { type: String, required: true }, 
    time: { type: String, required: true },
    duration: { type: Number, default: 30 }, // in minutes
    reason: { type: String, required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ["Booked", "Completed", "Canceled"],
      default: "Booked",
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual fields for frontend compatibility
appointmentSchema.virtual('doctorId').get(function() {
  return this.doctor;
});

appointmentSchema.virtual('patientId').get(function() {
  return this.patient;
});

module.exports = mongoose.model("Appointment", appointmentSchema);
