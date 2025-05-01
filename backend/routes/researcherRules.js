const express = require('express');
const router = express.Router();
const researcherController = require('../controllers/researcherController');
const upload = require('../middlewares/upload'); // For file uploads
const { checkRole } = require('../middlewares/roleMiddleware');

// ML Model routes
router.post('/upload-model', 
  checkRole('RESEARCHER'),
  upload.single('model'), 
  researcherController.uploadMLModel
);

// Rule proposal routes
router.post('/propose-rules', 
  checkRole('RESEARCHER'),
  researcherController.proposeRules
);
router.get('/my-pending-rules', 
  checkRole('RESEARCHER'),
  researcherController.getMyPendingRules
);

// Recommendation management
router.get('/recommendations-for-review',
  checkRole('RESEARCHER'),
  researcherController.getRecommendationsForReview
);
router.put('/update-recommendation/:id',
  checkRole('RESEARCHER'),
  researcherController.updateRecommendation
);

module.exports = router;