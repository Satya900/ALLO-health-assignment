const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

// book an appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, date, time, duration, reason, notes } = req.body;

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
      duration: duration || 30,
      reason,
      notes,
      status: 'Booked'
    });

    // Populate the appointment before sending response
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("doctor", "name specialization email phone")
      .populate("patient", "name email phone");

    res.status(201).json({ message: "Appointment booked", appointment: populatedAppointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || '';
    const doctorId = req.query.doctorId || '';
    const patientId = req.query.patientId || '';
    const date = req.query.date || '';

    // Build query
    let query = {};
    
    if (status) query.status = status;
    if (doctorId) query.doctor = doctorId;
    if (patientId) query.patient = patientId;
    if (date) query.date = date;

    // Get total count for pagination
    const total = await Appointment.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const appointments = await Appointment.find(query)
      .populate("doctor", "name specialization email phone")
      .populate("patient", "name email phone")
      .sort({ date: 1, time: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      appointments,
      page,
      limit,
      total,
      totalPages
    });
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
    const { notes } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    appointment.status = "Completed";
    if (notes) appointment.notes = notes;
    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("doctor", "name specialization email phone")
      .populate("patient", "name email phone");

    res.status(200).json({ message: "Appointment completed", appointment: populatedAppointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get single appointment
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("doctor", "name specialization email phone")
      .populate("patient", "name email phone");
    
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get today's appointments
exports.getTodaysAppointments = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const doctorId = req.query.doctorId || '';

    let query = { date: today };
    if (doctorId) query.doctor = doctorId;

    const appointments = await Appointment.find(query)
      .populate("doctor", "name specialization email phone")
      .populate("patient", "name email phone")
      .sort({ time: 1 });

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get upcoming appointments
exports.getUpcomingAppointments = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const limit = parseInt(req.query.limit) || 10;
    const doctorId = req.query.doctorId || '';
    const patientId = req.query.patientId || '';

    let query = { 
      date: { $gte: today },
      status: 'Booked'
    };
    
    if (doctorId) query.doctor = doctorId;
    if (patientId) query.patient = patientId;

    const appointments = await Appointment.find(query)
      .populate("doctor", "name specialization email phone")
      .populate("patient", "name email phone")
      .sort({ date: 1, time: 1 })
      .limit(limit);

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
