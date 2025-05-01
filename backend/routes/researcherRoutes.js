const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');
const {
  getWeather,
  getIrrigationPlans,
  getSoilInsights,
  getRecommendationTrends,
  getRuleAudit,
  proposeRules,
  getPendingRecommendations // ✅ Add this line
} = require('../controllers/researcherController');

// ✅ Allow researchers only
router.get('/weather', verifyToken, authorizeRoles('RESEARCHER'), getWeather);
router.get('/soil-insights', verifyToken, authorizeRoles('RESEARCHER'), getSoilInsights);
router.get('/trends', verifyToken, authorizeRoles('RESEARCHER'), getRecommendationTrends);
router.get('/rules', verifyToken, authorizeRoles('RESEARCHER'), getRuleAudit);
//router.get('/recommendations-for-review', verifyToken, authorizeRoles('RESEARCHER'), getPendingRecommendations); // ✅ New route
router.post('/propose-rules', verifyToken, authorizeRoles('RESEARCHER'), proposeRules);

// ✅ Shared route
router.get('/irrigation', verifyToken, authorizeRoles('FARMER', 'RESEARCHER'), getIrrigationPlans);

module.exports = router;
