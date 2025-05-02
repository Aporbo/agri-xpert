const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');
const {
  getSoilInsights,
  getRecommendationTrends,
  getRuleAudit,
  proposeRules,
  getAllSoilTests,
  updateSoilTest
} = require('../controllers/researcherController');

// Soil data analysis routes
router.get('/soil-insights', verifyToken, authorizeRoles('RESEARCHER'), getSoilInsights);
router.get('/trends', verifyToken, authorizeRoles('RESEARCHER'), getRecommendationTrends);
router.get('/rules', verifyToken, authorizeRoles('RESEARCHER'), getRuleAudit);
router.post('/propose-rules', verifyToken, authorizeRoles('RESEARCHER'), proposeRules);

// Soil test management routes
router.get('/soiltests', verifyToken, authorizeRoles('RESEARCHER'), getAllSoilTests);
router.put('/soiltests/:id', verifyToken, authorizeRoles('RESEARCHER'), updateSoilTest);

module.exports = router;