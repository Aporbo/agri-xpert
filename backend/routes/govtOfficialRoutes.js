const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');
const { getReports, generateReport } = require('../controllers/govtOfficialController');

// Protect all govt routes
router.use(verifyToken, authorizeRoles('GOVT_OFFICIAL'));

// Routes
router.get('/reports', getReports);
router.post('/generate-report/:soilTestId', generateReport);

module.exports = router;
