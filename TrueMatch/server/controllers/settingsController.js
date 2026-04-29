const User = require('../models/User');
const Interest = require('../models/Interest');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// ── GET /api/settings — Get user settings ──
const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('email isHidden photoVisibility notifications blockedUsers')
      .populate('blockedUsers', 'name photo');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
};

// ── PUT /api/settings/privacy — Update privacy settings ──
const updatePrivacy = async (req, res) => {
  try {
    const { isHidden, photoVisibility } = req.body;
    const update = {};
    if (typeof isHidden === 'boolean') update.isHidden = isHidden;
    if (['everyone', 'interests', 'accepted'].includes(photoVisibility)) update.photoVisibility = photoVisibility;
    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select('-password');
    res.json({ message: 'Privacy settings updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating privacy', error: error.message });
  }
};

// ── PUT /api/settings/notifications — Update notification prefs ──
const updateNotifications = async (req, res) => {
  try {
    const { email, push, interests, messages } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, {
      'notifications.email': email ?? true,
      'notifications.push': push ?? true,
      'notifications.interests': interests ?? true,
      'notifications.messages': messages ?? true,
    }, { new: true }).select('-password');
    res.json({ message: 'Notification preferences updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notifications', error: error.message });
  }
};

// ── PUT /api/settings/change-password — Change password ──
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Both passwords required' });
    if (newPassword.length < 6) return res.status(400).json({ message: 'Password must be 6+ characters' });
    const user = await User.findById(req.user._id);
    // Simple password check (assumes plain text or bcrypt — depends on existing auth)
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
};

// ── PUT /api/profile/block/:id — Toggle block user ──
const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const targetId = req.params.id;
    if (targetId === req.user._id.toString()) return res.status(400).json({ message: 'Cannot block yourself' });
    const index = user.blockedUsers.indexOf(targetId);
    if (index > -1) {
      user.blockedUsers.splice(index, 1);
      await user.save();
      res.json({ message: 'User unblocked' });
    } else {
      user.blockedUsers.push(targetId);
      await user.save();
      res.json({ message: 'User blocked' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error blocking user', error: error.message });
  }
};

// ── DELETE /api/settings/account — Delete account + cleanup ──
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    // Clean up related data
    await Promise.all([
      Interest.deleteMany({ $or: [{ sender: userId }, { receiver: userId }] }),
      Message.deleteMany({ $or: [{ sender: userId }, { receiver: userId }] }),
      Conversation.deleteMany({ participants: userId }),
      User.updateMany({ favourites: userId }, { $pull: { favourites: userId } }),
      User.updateMany({ blockedUsers: userId }, { $pull: { blockedUsers: userId } }),
    ]);
    await User.findByIdAndDelete(userId);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting account', error: error.message });
  }
};

// ── GET /api/settings/download-data — GDPR data export ──
const downloadMyData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').lean();
    const interests = await Interest.find({ $or: [{ sender: req.user._id }, { receiver: req.user._id }] })
      .populate('sender', 'name email').populate('receiver', 'name email').lean();
    const messages = await Message.find({ $or: [{ sender: req.user._id }, { receiver: req.user._id }] }).lean();
    const data = { profile: user, interests, messages, exportedAt: new Date().toISOString() };
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=truematch_my_data.json');
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting data', error: error.message });
  }
};

module.exports = { getSettings, updatePrivacy, updateNotifications, changePassword, toggleBlockUser, deleteAccount, downloadMyData };
