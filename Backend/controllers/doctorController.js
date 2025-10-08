const Doctor = require("../models/Doctor");

// create
exports.addDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json({ message: "Doctor added successfully", doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get all
exports.getAllDoctors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const specialization = req.query.specialization || '';
    const location = req.query.location || '';
    const isActive = req.query.isActive;

    // Build query
    let query = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Specialization filter
    if (specialization) {
      query.specialization = specialization;
    }
    
    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    // Active status filter
    if (isActive !== undefined && isActive !== null && isActive !== '') {
      query.isActive = isActive === 'true';
    }

    // Get total count for pagination
    const total = await Doctor.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    // Get doctors with pagination
    const doctors = await Doctor.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      doctors,
      page,
      limit,
      total,
      totalPages
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get one
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.status(200).json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update
exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.status(200).json({ message: "Doctor updated", doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// delete
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// toggle status
exports.toggleDoctorStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id, 
      { isActive }, 
      { new: true }
    );
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.status(200).json({ 
      message: `Doctor ${isActive ? 'activated' : 'deactivated'} successfully`, 
      doctor 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
