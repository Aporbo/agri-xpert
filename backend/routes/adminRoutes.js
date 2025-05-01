const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');
const User = require('../models/User');
const SoilTest = require('../models/SoilTest');
const Recommendation = require('../models/Recommendation');
const SoilRule = require('../models/SoilRule');

// ✅ Protect all admin routes
router.use(verifyToken, authorizeRoles('ADMIN'));

// ✅ User Management
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// ✅ Soil Tests
router.get('/soiltests', adminController.getAllSoilTests);
router.delete('/soiltests/:id', async (req, res) => {
  try {
    await SoilTest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Soil test deleted' });
  } catch (error) {
    console.error('Delete soil test error:', error);
    res.status(500).json({ message: 'Failed to delete soil test' });
  }
});

// ✅ Recommendations
router.post('/recommendation/:soilTestId', adminController.createRecommendation);

// ✅ Rules (Main)
router.get('/rules', adminController.getRules);
router.post('/rules', adminController.setRules);

// ✅ DELETE Rule — must be placed here BEFORE 'pending' and 'review' routes
router.delete('/rules/:id', async (req, res) => {
  try {
    const deleted = await SoilRule.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Rule not found' });
    res.json({ message: 'Rule deleted' });
  } catch (error) {
    console.error('Delete rule error:', error);
    res.status(500).json({ message: 'Failed to delete rule' });
  }
});

// ✅ Rule Moderation
router.get('/rules/pending', adminController.getPendingRules);
router.put('/rules/review/:id', adminController.reviewRuleProposal);

// ✅ Summary Stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'FARMER' });
    const totalResearchers = await User.countDocuments({ role: 'RESEARCHER' });
    const totalOfficials = await User.countDocuments({ role: 'GOVT_OFFICIAL' });
    const totalAdmins = await User.countDocuments({ role: 'ADMIN' });

    const totalTests = await SoilTest.countDocuments();
    const totalRecommendations = await Recommendation.countDocuments();

    res.json({
      users: {
        total: totalUsers,
        farmers: totalFarmers,
        researchers: totalResearchers,
        govt: totalOfficials,
        admins: totalAdmins
      },
      tests: totalTests,
      recommendations: totalRecommendations
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// ✅ Export the router
module.exports = router;
