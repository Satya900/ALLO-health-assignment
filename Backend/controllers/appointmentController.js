const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

// book an appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, date, time } = req.body;

    const doctor = await Doctor.findById(doctorId);
    const patient = await Patient.findById(patientId);

    if (!doctor || !patient) {
      return res.status(404).json({ message: "Doctor or patient not found" });
    }

    // optional: prevent double booking same doctor/time
    const existing = await Appointment.findOne({ doctor: doctorId, date, time });
    if (existing) {
      return res.status(400).json({ message: "Slot already booked for this time" });
    }

    const appointment = await Appointment.create({
      doctor: doctorId,
      patient: patientId,
      date,
      time,
    });

    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctor", "name specialization")
      .populate("patient", "name contact")
      .sort({ date: 1 });
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update (reschedule)
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    res.status(200).json({ message: "Appointment updated", appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// cancel
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    appointment.status = "Canceled";
    await appointment.save();

    res.status(200).json({ message: "Appointment canceled", appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// mark as completed
exports.completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    appointment.status = "Completed";
    await appointment.save();

    res.status(200).json({ message: "Appointment completed", appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
