const Patient = require("../models/Patient");

// add new patient
exports.addPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json({ message: "Patient added successfully", patient });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const gender = req.query.gender || '';
    const ageRange = req.query.ageRange || '';

    // Build query
    let query = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Gender filter
    if (gender) {
      query.gender = gender;
    }
    
    // Age range filter
    if (ageRange) {
      switch (ageRange) {
        case 'child':
          query.age = { $lt: 18 };
          break;
        case 'adult':
          query.age = { $gte: 18, $lt: 65 };
          break;
        case 'senior':
          query.age = { $gte: 65 };
          break;
      }
    }

    // Get total count for pagination
    const total = await Patient.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    // Get patients with pagination
    const patients = await Patient.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      patients,
      page,
      limit,
      total,
      totalPages
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update patient
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json({ message: "Patient updated successfully", patient });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// delete patient
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
