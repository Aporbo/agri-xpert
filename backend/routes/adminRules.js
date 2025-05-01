const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { checkRole } = require('../middlewares/roleMiddleware');

router.get('/pending-rules',
  checkRole('ADMIN'),
  adminController.getPendingRules
);
router.put('/review-rule/:id',
  checkRole('ADMIN'),
  adminController.reviewRuleProposal
);
router.get('/pending-recommendations',
  checkRole('ADMIN'),
  adminController.getPendingRecommendations
);

module.exports = router;