// =============================================
// PROFILE CONTROLLER
// Syllabus: Route Handlers, Response Methods
// =============================================
// Handles all profile-related operations:
// create, update, search, filter, favourites, admin actions

const User = require('../models/User');

// =============================================
// @desc    Create / Update user profile
// @route   PUT /api/profile
// @access  Private
// =============================================
const updateProfile = async (req, res) => {
  try {
    const { age, religion, caste, profession, education, city, bio } = req.body;

    // Build update object
    const profileData = {
      age,
      religion,
      caste,
      profession,
      education,
      city,
      bio,
      isProfileComplete: true,
    };

    // If a photo was uploaded via Multer, add filename
    if (req.file) {
      profileData.photo = req.file.filename;
    }

    // Find user and update their profile
    const user = await User.findByIdAndUpdate(
      req.user._id,
      profileData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// =============================================
// @desc    Get my profile
// @route   GET /api/profile/me
// @access  Private
// =============================================
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// =============================================
// @desc    Get a single profile by ID
// @route   GET /api/profile/:id
// @access  Private
// Syllabus: Route Parameters
// =============================================
const getProfileById = async (req, res) => {
  try {
    // req.params.id comes from the URL parameter :id
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// =============================================
// @desc    Search & filter profiles
// @route   GET /api/profile/search
// @access  Private
// Syllabus: Route Handlers, Query Parameters
// =============================================
const searchProfiles = async (req, res) => {
  try {
    // Get filter values from query string
    // Example: /api/profile/search?religion=Hindu&city=Mumbai&minAge=25&maxAge=35
    const { religion, city, profession, minAge, maxAge, gender } = req.query;

    // Build filter object dynamically
    const filter = {
      _id: { $ne: req.user._id }, // Exclude current user
      isProfileComplete: true,
      isApproved: true,
    };

    // Add filters only if provided (case-insensitive regex)
    if (religion) filter.religion = new RegExp(`^${religion}$`, 'i');
    if (city) filter.city = new RegExp(city, 'i');
    if (profession) filter.profession = new RegExp(profession, 'i');
    if (gender) filter.gender = gender;

    // Age range filter
    if (minAge || maxAge) {
      filter.age = {};
      if (minAge) filter.age.$gte = parseInt(minAge);
      if (maxAge) filter.age.$lte = parseInt(maxAge);
    }

    const profiles = await User.find(filter).select('-password').sort({ createdAt: -1 });

    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: 'Error searching profiles', error: error.message });
  }
};

// =============================================
// @desc    Get all approved profiles
// @route   GET /api/profile
// @access  Private
// =============================================
const getAllProfiles = async (req, res) => {
  try {
    const profiles = await User.find({
      _id: { $ne: req.user._id },
      isProfileComplete: true,
      isApproved: true,
    })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profiles', error: error.message });
  }
};

// =============================================
// @desc    Add/Remove profile to favourites
// @route   PUT /api/profile/favourite/:id
// @access  Private
// =============================================
const toggleFavourite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const profileId = req.params.id;

    // Check if already in favourites
    const index = user.favourites.indexOf(profileId);

    if (index > -1) {
      // Remove from favourites
      user.favourites.splice(index, 1);
      await user.save();
      res.json({ message: 'Removed from favourites', favourites: user.favourites });
    } else {
      // Add to favourites
      user.favourites.push(profileId);
      await user.save();
      res.json({ message: 'Added to favourites', favourites: user.favourites });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating favourites', error: error.message });
  }
};

// =============================================
// @desc    Get my favourite profiles
// @route   GET /api/profile/favourites
// @access  Private
// =============================================
const getFavourites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favourites', '-password');
    res.json(user.favourites);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favourites', error: error.message });
  }
};

// =============================================
// @desc    Report a profile
// @route   PUT /api/profile/report/:id
// @access  Private
// =============================================
const reportProfile = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isReported: true });
    res.json({ message: 'Profile reported successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error reporting profile', error: error.message });
  }
};

// =============================================
// ADMIN CONTROLLERS
// =============================================

// @desc    Get all users (Admin)
// @route   GET /api/profile/admin/users
// @access  Private/Admin
const adminGetAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// @desc    Approve a profile (Admin)
// @route   PUT /api/profile/admin/approve/:id
// @access  Private/Admin
const adminApproveProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile approved', user });
  } catch (error) {
    res.status(500).json({ message: 'Error approving profile', error: error.message });
  }
};

// @desc    Delete a user (Admin)
// @route   DELETE /api/profile/admin/user/:id
// @access  Private/Admin
const adminDeleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// @desc    Get reported profiles (Admin)
// @route   GET /api/profile/admin/reported
// @access  Private/Admin
const adminGetReported = async (req, res) => {
  try {
    const reported = await User.find({ isReported: true }).select('-password');
    res.json(reported);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reported profiles', error: error.message });
  }
};

module.exports = {
  updateProfile,
  getMyProfile,
  getProfileById,
  searchProfiles,
  getAllProfiles,
  toggleFavourite,
  getFavourites,
  reportProfile,
  adminGetAllUsers,
  adminApproveProfile,
  adminDeleteUser,
  adminGetReported,
};
