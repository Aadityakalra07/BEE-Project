const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getSettings, updatePrivacy, updateNotifications,
  changePassword, toggleBlockUser, deleteAccount, downloadMyData,
} = require('../controllers/settingsController');

router.get('/', protect, getSettings);
router.put('/privacy', protect, updatePrivacy);
router.put('/notifications', protect, updateNotifications);
router.put('/change-password', protect, changePassword);
router.put('/block/:id', protect, toggleBlockUser);
router.delete('/account', protect, deleteAccount);
router.get('/download-data', protect, downloadMyData);

module.exports = router;
