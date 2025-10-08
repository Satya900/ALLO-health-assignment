const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is not set. Set it in your environment for production.');
}

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('registerUser error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      // Avoid revealing whether email exists for security — generic message
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!JWT_SECRET) {
      return res.status(500).json({ message: 'JWT secret not configured' });
    }

    const token = jwt.sign(
      { id: existingUser._id, role: existingUser.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: "Login successful",
      token: token, // Include token in response for frontend
      user: { 
        id: existingUser._id,
        name: existingUser.name, 
        email: existingUser.email,
        role: existingUser.role 
      },
    });

  } catch (error) {
    console.error('loginUser error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const logoutUser = (req,res)=>{
    res.clearCookie('token',{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite:'strict'
    })

    res.status(200).json({
        message:"Logged Out Successfully"
    })
}
module.exports = { registerUser, loginUser, logoutUser };
