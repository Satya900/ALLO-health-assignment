const Queue = require("../models/Queue");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

// add walk-in patient to queue
exports.addToQueue = async (req, res) => {
  try {
    const { patientId, doctorId, priority, notes, appointmentId } = req.body;

    const patient = await Patient.findById(patientId);
    const doctor = await Doctor.findById(doctorId);
    if (!patient || !doctor)
      return res.status(404).json({ message: "Doctor or patient not found" });

    const count = await Queue.countDocuments({ doctor: doctorId });
    const queueNumber = count + 1;

    const queueEntry = await Queue.create({
      patient: patientId,
      doctor: doctorId,
      appointment: appointmentId || null,
      queueNumber,
      priority: priority || "Normal",
      notes: notes || '',
      status: 'Waiting'
    });

    // Populate the queue entry before sending response
    const populatedQueueEntry = await Queue.findById(queueEntry._id)
      .populate("patient", "name email phone")
      .populate("doctor", "name specialization")
      .populate("appointment", "date time reason");

    res
      .status(201)
      .json({ message: "Patient added to queue", queueItem: populatedQueueEntry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get queue (sorted)
exports.getQueue = async (req, res) => {
  try {
    const doctorId = req.query.doctorId || '';
    const status = req.query.status || '';
    const priority = req.query.priority || '';

    // Build query
    let query = {};
    
    if (doctorId) query.doctor = doctorId;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const queue = await Queue.find(query)
      .populate("patient", "name email phone")
      .populate("doctor", "name specialization")
      .populate("appointment", "date time reason")
      .sort({ priority: -1, queueNumber: 1 });

    res.status(200).json({ queue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update queue status
exports.updateQueueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const entry = await Queue.findById(id);
    if (!entry) return res.status(404).json({ message: "Queue entry not found" });

    entry.status = status;
    if (notes) entry.notes = notes;
    
    if (status === 'With Doctor') {
      entry.calledAt = new Date();
    } else if (status === 'Completed') {
      entry.completedAt = new Date();
    }
    
    await entry.save();

    // Populate the entry before sending response
    const populatedEntry = await Queue.findById(entry._id)
      .populate("patient", "name email phone")
      .populate("doctor", "name specialization")
      .populate("appointment", "date time reason");

    res.status(200).json({ message: "Queue status updated", queueItem: populatedEntry });
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

// get today's queue
exports.getTodayQueue = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    
    // Set to start and end of day
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const queue = await Queue.find({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    })
      .populate("patient", "name contact")
      .populate("doctor", "name specialization")
      .sort({ priority: -1, queueNumber: 1 });

    res.status(200).json(queue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get queue statistics
exports.getQueueStats = async (req, res) => {
  try {
    const { date, doctorId } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    
    // Set to start and end of day
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    let baseQuery = {
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    };

    if (doctorId) {
      baseQuery.doctor = doctorId;
    }

    const totalPatients = await Queue.countDocuments(baseQuery);

    const waitingPatients = await Queue.countDocuments({
      ...baseQuery,
      status: "Waiting"
    });

    const withDoctorPatients = await Queue.countDocuments({
      ...baseQuery,
      status: "With Doctor"
    });

    const completedPatients = await Queue.countDocuments({
      ...baseQuery,
      status: "Completed"
    });

    const urgentPatients = await Queue.countDocuments({
      ...baseQuery,
      priority: "Urgent"
    });

    const stats = {
      total: totalPatients,
      waiting: waitingPatients,
      withDoctor: withDoctorPatients,
      completed: completedPatients,
      urgent: urgentPatients,
      averageWaitTime: 0 // TODO: Calculate based on actual wait times
    };

    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update queue priority
exports.updateQueuePriority = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    const entry = await Queue.findById(id);
    if (!entry) return res.status(404).json({ message: "Queue entry not found" });

    entry.priority = priority;
    await entry.save();

    // Populate the entry before sending response
    const populatedEntry = await Queue.findById(entry._id)
      .populate("patient", "name email phone")
      .populate("doctor", "name specialization")
      .populate("appointment", "date time reason");

    res.status(200).json({ message: "Queue priority updated", queueItem: populatedEntry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get single queue item
exports.getQueueItem = async (req, res) => {
  try {
    const queueItem = await Queue.findById(req.params.id)
      .populate("patient", "name email phone")
      .populate("doctor", "name specialization")
      .populate("appointment", "date time reason");
    
    if (!queueItem) {
      return res.status(404).json({ message: "Queue item not found" });
    }

    res.status(200).json(queueItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// call next patient
exports.callNextPatient = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Find the next waiting patient for this doctor
    const nextPatient = await Queue.findOne({
      doctor: doctorId,
      status: 'Waiting'
    })
    .sort({ priority: -1, queueNumber: 1 }) // Urgent first, then by queue number
    .populate("patient", "name email phone")
    .populate("doctor", "name specialization")
    .populate("appointment", "date time reason");

    if (!nextPatient) {
      return res.status(404).json({ message: "No patients waiting in queue" });
    }

    // Update status to "With Doctor"
    nextPatient.status = 'With Doctor';
    nextPatient.calledAt = new Date();
    await nextPatient.save();

    res.status(200).json({ 
      message: "Next patient called", 
      queueItem: nextPatient 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
