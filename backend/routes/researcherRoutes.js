const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');
const {
  getWeather,
  getIrrigationPlans,
  getSoilInsights,
  getRecommendationTrends,
  getRuleAudit
} = require('../controllers/researcherController');

router.use(verifyToken, authorizeRoles('RESEARCHER'));

router.get('/weather', getWeather);
router.get('/irrigation', getIrrigationPlans);
router.get('/soil-insights', getSoilInsights);
router.get('/trends', getRecommendationTrends);
router.get('/rules', getRuleAudit);

module.exports = router;
