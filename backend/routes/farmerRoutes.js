const express = require('express');
const router = express.Router();

const {
  submitSoilTest,
  getMySoilTests,
  getWeather,
  getRecommendation,
  updateProfile,
  updatePassword,
  getIrrigationPlans // ✅ Add this here instead
} = require('../controllers/farmerController');

const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

const PDFDocument = require('pdfkit');
const Recommendation = require('../models/Recommendation');
const SoilTest = require('../models/SoilTest');

console.log('verifyToken typeof:', typeof verifyToken);
console.log('authorizeRoles typeof:', typeof authorizeRoles);
console.log('authorizeRoles(...) typeof:', typeof authorizeRoles('FARMER', 'ADMIN'));

// 🧪 Soil Test
router.post('/soil-test', verifyToken, authorizeRoles('FARMER'), submitSoilTest);
router.get('/my-tests', verifyToken, authorizeRoles('FARMER'), getMySoilTests);

// 🌦 Weather
router.get('/weather', verifyToken, authorizeRoles('FARMER'), getWeather);

// 📋 Recommendation
router.get('/recommendation/:soilTestId', verifyToken, authorizeRoles('FARMER', 'ADMIN'), getRecommendation);

// 💧 Irrigation (✅ Fix here)
router.get('/irrigation', verifyToken, authorizeRoles('FARMER'), getIrrigationPlans);

// 👤 Profile
router.put('/profile', verifyToken, authorizeRoles('FARMER'), updateProfile);
router.put('/profile/password', verifyToken, authorizeRoles('FARMER'), updatePassword);

// 📄 PDF Report
router.get('/download/:soilTestId', verifyToken, authorizeRoles('FARMER'), async (req, res) => {
  try {
    const recommendation = await Recommendation.findOne({ soilTest: req.params.soilTestId }).populate('soilTest');
    if (!recommendation) return res.status(404).json({ message: 'No recommendation found' });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="recommendation.pdf"');

    doc.pipe(res);
    doc.fontSize(18).text('Soil Recommendation Report', { align: 'center' }).moveDown();
    doc.fontSize(12);
    doc.text(`Soil Type: ${recommendation.soilTest.soilType}`);
    doc.text(`pH: ${recommendation.soilTest.pH}`);
    doc.text(`Moisture: ${recommendation.soilTest.moisture}`);
    doc.text(`Nitrogen: ${recommendation.soilTest.nitrogen}`);
    doc.text(`Phosphorus: ${recommendation.soilTest.phosphorus}`);
    doc.text(`Potassium: ${recommendation.soilTest.potassium}`);
    doc.moveDown();
    doc.text(`Recommended Crop: ${recommendation.cropSuggestion}`);
    doc.text(`Fertilizer: ${recommendation.fertilizerSuggestion}`);
    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error.message);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
});

module.exports = router;
