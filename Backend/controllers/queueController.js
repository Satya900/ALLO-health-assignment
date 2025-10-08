const Queue = require("../models/Queue");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

// add walk-in patient to queue
exports.addToQueue = async (req, res) => {
  try {
    const { patientId, doctorId, priority } = req.body;

    const patient = await Patient.findById(patientId);
    const doctor = await Doctor.findById(doctorId);
    if (!patient || !doctor)
      return res.status(404).json({ message: "Doctor or patient not found" });

    const count = await Queue.countDocuments({ doctor: doctorId });
    const queueNumber = count + 1;

    const queueEntry = await Queue.create({
      patient: patientId,
      doctor: doctorId,
      queueNumber,
      priority: priority || "Normal",
    });

    res
      .status(201)
      .json({ message: "Patient added to queue", queue: queueEntry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get queue (sorted)
exports.getQueue = async (req, res) => {
  try {
    const queue = await Queue.find()
      .populate("patient", "name contact")
      .populate("doctor", "name specialization")
      .sort({ priority: -1, queueNumber: 1 });

    res.status(200).json(queue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update queue status
exports.updateQueueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const entry = await Queue.findById(id);
    if (!entry) return res.status(404).json({ message: "Queue entry not found" });

    entry.status = status;
    await entry.save();

    res.status(200).json({ message: "Queue status updated", entry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// remove from queue
exports.removeFromQueue = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await Queue.findByIdAndDelete(id);
    if (!entry) return res.status(404).json({ message: "Queue entry not found" });
    res.status(200).json({ message: "Removed from queue" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
