const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');
const { getWeather, getIrrigationPlans } = require('../controllers/researcherController');
const { getSoilInsights, getRecommendationTrends, getRuleAudit } = require('../controllers/researcherController');

// Protect all researcher routes
router.use(verifyToken, authorizeRoles('RESEARCHER'));

// Routes
router.get('/weather', getWeather);
router.get('/irrigation', getIrrigationPlans);
router.get('/insights', verifyToken, authorizeRoles('RESEARCHER'), getSoilInsights);
router.get('/trends', verifyToken, authorizeRoles('RESEARCHER'), getRecommendationTrends);
router.get('/rules', verifyToken, authorizeRoles('RESEARCHER'), getRuleAudit);
router.get('/soil-insights', verifyToken, authorizeRoles('RESEARCHER'), getSoilInsights);

module.exports = router;
