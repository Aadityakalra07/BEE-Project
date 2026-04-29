// =============================================
// AUTH CONTROLLER
// Syllabus: Handling HTTP Requests, Response Methods
// =============================================
// This controller handles user registration and login.
// It uses bcryptjs for password hashing and JWT for tokens.

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper: Generate JWT Token
// Takes user ID, returns a signed token valid for 30 days
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// =============================================
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// =============================================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, gender, dob } = req.body;

    if (!name || !email || !password || !gender) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Age restriction: must be at least 21
    if (!dob) {
      return res.status(400).json({ message: 'Date of birth is required' });
    }
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    if (age < 21) {
      return res.status(400).json({ message: 'You must be at least 21 years old to register' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash the password (never store plain text passwords!)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      gender,
      photo: req.file ? req.file.filename : '',
      authProvider: 'local',
    });

    // Send response with token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      photo: user.photo,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// =============================================
// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
// =============================================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.authProvider === 'google') {
      return res.status(400).json({ message: 'This account uses Google sign-in. Please continue with Google.' });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Send response with token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      photo: user.photo,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// =============================================
// @desc    Login/Register with Google ID token
// @route   POST /api/auth/google
// @access  Public
// =============================================
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: 'Google OAuth is not configured on server' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email || !payload?.sub || payload?.email_verified !== true) {
      return res.status(401).json({ message: 'Invalid Google token' });
    }

    const email = payload.email.toLowerCase();
    const googleId = payload.sub;
    const name = payload.name || email.split('@')[0];

    let user = await User.findOne({ email });

    if (user && user.authProvider === 'local' && !user.googleId) {
      return res.status(409).json({
        message: 'An email/password account already exists with this email. Please sign in with password.',
      });
    }

    if (!user) {
      user = await User.create({
        name,
        email,
        gender: 'Other',
        authProvider: 'google',
        googleId,
        photo: '',
      });
    } else {
      let shouldSave = false;

      if (!user.googleId) {
        user.googleId = googleId;
        shouldSave = true;
      }

      if (user.authProvider !== 'google') {
        user.authProvider = 'google';
        shouldSave = true;
      }

      if (name && user.name !== name) {
        user.name = name;
        shouldSave = true;
      }

      if (shouldSave) {
        await user.save();
      }
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      photo: user.photo,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(401).json({ message: 'Google authentication failed', error: error.message });
  }
};

// =============================================
// @desc    Get logged-in user's profile
// @route   GET /api/auth/me
// @access  Private (requires token)
// =============================================
const getMe = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { registerUser, loginUser, googleLogin, getMe };
