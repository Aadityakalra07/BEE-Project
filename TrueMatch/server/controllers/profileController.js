// =============================================
// PROFILE CONTROLLER
// Syllabus: Route Handlers, Response Methods
// =============================================
// Handles all profile-related operations:
// create, update, search, filter, favourites, admin actions,
// compatibility matching

const User = require('../models/User');
const Interest = require('../models/Interest');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Report = require('../models/Report');

// =============================================
// @desc    Create / Update user profile
// @route   PUT /api/profile
// @access  Private
// =============================================
const updateProfile = async (req, res) => {
  try {
    const { age, religion, caste, profession, education, city, bio, partnerPreferences } = req.body;

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

    // Parse and add partner preferences if provided
    if (partnerPreferences) {
      const prefs = typeof partnerPreferences === 'string'
        ? JSON.parse(partnerPreferences)
        : partnerPreferences;
      profileData.partnerPreferences = {
        minAge: prefs.minAge || undefined,
        maxAge: prefs.maxAge || undefined,
        religion: Array.isArray(prefs.religion) ? prefs.religion.filter(Boolean) : [],
        city: Array.isArray(prefs.city) ? prefs.city.filter(Boolean) : [],
        education: Array.isArray(prefs.education) ? prefs.education.filter(Boolean) : [],
        profession: Array.isArray(prefs.profession) ? prefs.profession.filter(Boolean) : [],
      };
    }

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

    // Get current user's blocked list
    const currentUser = await User.findById(req.user._id).select('blockedUsers');
    const blockedIds = currentUser?.blockedUsers || [];

    // Build filter object dynamically
    const filter = {
      _id: { $ne: req.user._id, $nin: blockedIds },
      isProfileComplete: true,
      isApproved: true,
      isSuspended: { $ne: true },
      isHidden: { $ne: true },
      blockedUsers: { $ne: req.user._id },
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
    // Get current user's blocked list
    const currentUser = await User.findById(req.user._id).select('blockedUsers');
    const blockedIds = currentUser?.blockedUsers || [];

    const profiles = await User.find({
      _id: { $ne: req.user._id, $nin: blockedIds },
      isProfileComplete: true,
      isApproved: true,
      isSuspended: { $ne: true },
      isHidden: { $ne: true },
      blockedUsers: { $ne: req.user._id },
    })
      .select('-password')
      .sort({ verificationLevel: -1, createdAt: -1 });

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
    const reportedId = req.params.id;
    const { reason, description } = req.body;

    // Can't report yourself
    if (req.user._id.toString() === reportedId) {
      return res.status(400).json({ message: "You can't report yourself" });
    }

    // Check if already reported by this user (unique index will also catch this)
    const existing = await Report.findOne({ reporter: req.user._id, reportedUser: reportedId });
    if (existing) {
      return res.status(400).json({ message: 'You have already reported this profile' });
    }

    // Create report record
    await Report.create({
      reporter: req.user._id,
      reportedUser: reportedId,
      reason: reason || 'other',
      description: description || '',
    });

    // Also flag the user as reported for quick admin filtering
    await User.findByIdAndUpdate(reportedId, { isReported: true });

    res.json({ message: 'Profile reported successfully. Our team will review it.' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reported this profile' });
    }
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
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // BUG 20 FIX: Cascade delete all related data
    await Promise.all([
      Interest.deleteMany({ $or: [{ sender: userId }, { receiver: userId }] }),
      Message.deleteMany({ $or: [{ sender: userId }, { receiver: userId }] }),
      Conversation.deleteMany({ participants: userId }),
      Report.deleteMany({ $or: [{ reporter: userId }, { reportedUser: userId }] }),
      User.updateMany({ favourites: userId }, { $pull: { favourites: userId } }),
      User.updateMany({ blockedUsers: userId }, { $pull: { blockedUsers: userId } }),
    ]);
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User and all related data deleted successfully' });
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

// =============================================
// COMPATIBILITY SCORING ALGORITHM
// Weights: Age 20%, Religion 20%, City 15%,
//          Education 15%, Profession 15%, Mutual Interest 15%
// =============================================
// BUG 6 FIX: Accepts pre-fetched interests array to avoid N+1 queries
const calculateCompatibility = (currentUser, otherUser, userInterests) => {
  let score = 0;
  const prefs = currentUser.partnerPreferences || {};
  const otherPrefs = otherUser.partnerPreferences || {};

  // 1. AGE MATCH (20%) — bidirectional
  let ageScore = 0;
  if (prefs.minAge && prefs.maxAge && otherUser.age) {
    if (otherUser.age >= prefs.minAge && otherUser.age <= prefs.maxAge) ageScore += 0.5;
    else {
      const dist = Math.min(Math.abs(otherUser.age - prefs.minAge), Math.abs(otherUser.age - prefs.maxAge));
      ageScore += Math.max(0, 0.5 - dist * 0.05);
    }
  } else if (otherUser.age && currentUser.age) {
    const diff = Math.abs(currentUser.age - otherUser.age);
    ageScore += Math.max(0, 0.5 - diff * 0.04);
  }
  if (otherPrefs.minAge && otherPrefs.maxAge && currentUser.age) {
    if (currentUser.age >= otherPrefs.minAge && currentUser.age <= otherPrefs.maxAge) ageScore += 0.5;
    else ageScore += Math.max(0, 0.5 - Math.min(Math.abs(currentUser.age - otherPrefs.minAge), Math.abs(currentUser.age - otherPrefs.maxAge)) * 0.05);
  } else { ageScore += 0.25; }
  score += ageScore * 20;

  // 2. RELIGION MATCH (20%)
  let religionScore = 0;
  if (prefs.religion?.length > 0 && otherUser.religion) {
    religionScore += prefs.religion.some(r => r.toLowerCase() === otherUser.religion.toLowerCase()) ? 0.5 : 0;
  } else { religionScore += 0.25; }
  if (otherPrefs.religion?.length > 0 && currentUser.religion) {
    religionScore += otherPrefs.religion.some(r => r.toLowerCase() === currentUser.religion.toLowerCase()) ? 0.5 : 0;
  } else { religionScore += 0.25; }
  score += religionScore * 20;

  // 3. CITY MATCH (15%)
  let cityScore = 0;
  if (prefs.city?.length > 0 && otherUser.city) {
    cityScore += prefs.city.some(c => c.toLowerCase() === otherUser.city.toLowerCase()) ? 0.5 : 0;
  } else if (currentUser.city && otherUser.city && currentUser.city.toLowerCase() === otherUser.city.toLowerCase()) {
    cityScore += 0.5;
  } else { cityScore += 0.15; }
  if (otherPrefs.city?.length > 0 && currentUser.city) {
    cityScore += otherPrefs.city.some(c => c.toLowerCase() === currentUser.city.toLowerCase()) ? 0.5 : 0;
  } else { cityScore += 0.15; }
  score += cityScore * 15;

  // 4. EDUCATION MATCH (15%)
  let eduScore = 0;
  if (prefs.education?.length > 0 && otherUser.education) {
    eduScore += prefs.education.some(e => e.toLowerCase() === otherUser.education.toLowerCase()) ? 1 : 0;
  } else if (currentUser.education && otherUser.education && currentUser.education.toLowerCase() === otherUser.education.toLowerCase()) {
    eduScore += 0.7;
  } else { eduScore += 0.3; }
  score += eduScore * 15;

  // 5. PROFESSION MATCH (15%)
  let profScore = 0;
  if (prefs.profession?.length > 0 && otherUser.profession) {
    profScore += prefs.profession.some(p => otherUser.profession.toLowerCase().includes(p.toLowerCase())) ? 1 : 0;
  } else { profScore += 0.3; }
  score += profScore * 15;

  // 6. MUTUAL INTEREST (15%) — lookup from pre-fetched array
  const otherId = otherUser._id.toString();
  const interest = userInterests.find(i =>
    (i.sender.toString() === otherId || i.receiver.toString() === otherId)
  );
  if (interest && interest.status === 'accepted') score += 15;
  else if (interest) score += 5; // Partial credit for pending

  return Math.min(99, Math.max(10, Math.round(score)));
};

// =============================================
// @desc    Get compatible profiles (sorted by score)
// @route   GET /api/profile/compatible
// @access  Private
// =============================================
const getCompatibleProfiles = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) return res.status(404).json({ message: 'User not found' });

    const profiles = await User.find({
      _id: { $ne: req.user._id },
      isProfileComplete: true,
      isApproved: true,
    }).select('-password');

    // BUG 6 FIX: Pre-fetch ALL interests for current user in ONE query
    const userInterests = await Interest.find({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id },
      ],
    });

    // Calculate compatibility using pre-fetched data (no N+1 queries)
    const scored = profiles.map((profile) => {
      const compatibilityScore = calculateCompatibility(currentUser, profile, userInterests);
      return { ...profile.toObject(), compatibilityScore };
    });

    // Sort by compatibility (highest first)
    scored.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    res.json(scored);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching compatible profiles', error: error.message });
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
  getCompatibleProfiles,
};
