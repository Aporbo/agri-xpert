const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  soilTest: { type: mongoose.Schema.Types.ObjectId, ref: 'SoilTest', required: true },
  cropSuggestion: { type: String, required: true },
  fertilizerSuggestion: { type: String, required: true },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdOn: { type: Date, default: Date.now },
  source: { 
    type: String, 
    enum: ['manual', 'ml', 'modified'], 
    default: 'manual' 
  },
  status: { 
    type: String, 
    enum: ['approved', 'pending', 'rejected'], 
    default: 'approved' 
  },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mlModelUsed: { type: mongoose.Schema.Types.ObjectId, ref: 'MLModel' },
  confidenceScore: Number, // For ML recommendations
  createdAt: { type: Date, default: Date.now }

});

module.exports = mongoose.model('Recommendation', recommendationSchema);
