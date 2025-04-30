const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');
const {
  submitSoilTest,
  getMySoilTests,
  getWeather,
  getRecommendation,
} = require('../controllers/farmerController');

// Apply both middlewares
router.post('/soil-test', verifyToken, authorizeRoles('FARMER'), submitSoilTest);
router.get('/my-tests', verifyToken, authorizeRoles('FARMER'), getMySoilTests);
router.get('/weather', verifyToken, authorizeRoles('FARMER'), getWeather);
router.get('/recommendation/:soilTestId', verifyToken, authorizeRoles('FARMER'), getRecommendation);


module.exports = router;
