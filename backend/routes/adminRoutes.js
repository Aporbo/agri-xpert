const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');
const { getAllSoilTests, createRecommendation } = require('../controllers/adminController');
const adminController = require('../controllers/adminController');

// Protect all admin routes
router.use(verifyToken, authorizeRoles('ADMIN'));

// Routes
router.get('/soiltests', getAllSoilTests);
router.post('/recommendation/:soilTestId', createRecommendation);
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.post('/rules', verifyToken, authorizeRoles('ADMIN'), adminController.setRules);
router.get('/rules', verifyToken, authorizeRoles('ADMIN'), adminController.getRules);


// Soil Rules
router.post('/soil-rules', adminController.setRules);
router.get('/soil-rules', adminController.getRules);

module.exports = router;
