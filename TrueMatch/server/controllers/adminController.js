const User = require('../models/User');
const VerificationRequest = require('../models/VerificationRequest');

// ── GET /api/admin/stats — Dashboard analytics data ──
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const approved = await User.countDocuments({ isApproved: true });
    const pending = await User.countDocuments({ isApproved: false, isProfileComplete: true });
    const reported = await User.countDocuments({ isReported: true });
    const suspended = await User.countDocuments({ isSuspended: true });

    // Gender distribution
    const genderDist = await User.aggregate([
      { $match: { gender: { $exists: true, $ne: null } } },
      { $group: { _id: '$gender', count: { $sum: 1 } } },
    ]);

    // Religion distribution
    const religionDist = await User.aggregate([
      { $match: { religion: { $exists: true, $ne: null } } },
      { $group: { _id: '$religion', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // City distribution (top 10)
    const cityDist = await User.aggregate([
      { $match: { city: { $exists: true, $ne: null, $ne: '' } } },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Registrations over last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const registrations = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Verification stats
    const verificationPending = await VerificationRequest.countDocuments({ status: 'pending' });

    res.json({
      totalUsers, approved, pending, reported, suspended, verificationPending,
      genderDist: genderDist.map((g) => ({ name: g._id, value: g.count })),
      religionDist: religionDist.map((r) => ({ name: r._id, value: r.count })),
      cityDist: cityDist.map((c) => ({ name: c._id, value: c.count })),
      registrations: registrations.map((r) => ({ date: r._id, count: r.count })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

// ── PUT /api/admin/suspend/:id — Toggle suspend ──
const toggleSuspend = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isSuspended = !user.isSuspended;
    await user.save();
    res.json({ message: user.isSuspended ? 'User suspended' : 'User unsuspended', isSuspended: user.isSuspended });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling suspend', error: error.message });
  }
};

// ── PUT /api/admin/approve-all — Approve all pending profiles ──
const approveAll = async (req, res) => {
  try {
    const result = await User.updateMany(
      { isApproved: false, isProfileComplete: true },
      { isApproved: true }
    );
    res.json({ message: `${result.modifiedCount} profiles approved` });
  } catch (error) {
    res.status(500).json({ message: 'Error approving all', error: error.message });
  }
};

// ── GET /api/admin/export-csv — Export users as CSV ──
const exportUsersCSV = async (req, res) => {
  try {
    const users = await User.find().select('name email gender age religion city profession education isApproved isReported isSuspended verificationLevel createdAt').lean();
    const headers = 'Name,Email,Gender,Age,Religion,City,Profession,Education,Approved,Reported,Suspended,Verification,Joined\n';
    const rows = users.map((u) =>
      `"${u.name || ''}","${u.email || ''}","${u.gender || ''}",${u.age || ''},"${u.religion || ''}","${u.city || ''}","${u.profession || ''}","${u.education || ''}",${u.isApproved},${u.isReported},${u.isSuspended || false},"${u.verificationLevel || 'none'}","${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''}"`
    ).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=truematch_users.csv');
    res.send(headers + rows);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting', error: error.message });
  }
};

// ── GET /api/admin/verification-requests — List pending verifications ──
const getVerificationRequests = async (req, res) => {
  try {
    const requests = await VerificationRequest.find({ status: 'pending' })
      .populate('user', 'name email photo verificationLevel')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error: error.message });
  }
};

// ── PUT /api/admin/verification/:id — Approve or reject verification ──
const reviewVerification = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' });
    }
    const request = await VerificationRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = status;
    request.adminNote = adminNote || '';
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();
    await request.save();

    // If approved, upgrade user verification level
    if (status === 'approved') {
      const levelMap = { photo: 'photo', id: 'id' };
      const newLevel = levelMap[request.type] || 'basic';
      const user = await User.findById(request.user);
      const levelOrder = ['none', 'basic', 'photo', 'id', 'premium'];
      if (levelOrder.indexOf(newLevel) > levelOrder.indexOf(user.verificationLevel)) {
        user.verificationLevel = newLevel;
        await user.save();
      }
    }

    res.json({ message: `Verification ${status}` });
  } catch (error) {
    res.status(500).json({ message: 'Error reviewing verification', error: error.message });
  }
};

module.exports = { getAdminStats, toggleSuspend, approveAll, exportUsersCSV, getVerificationRequests, reviewVerification };
