const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  soilTest: { type: mongoose.Schema.Types.ObjectId, ref: 'SoilTest' }, // ⬅️ now optional
  cropSuggestion: { type: String, required: true },
  fertilizerSuggestion: { type: String, required: true },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdOn: { type: Date, default: Date.now },
  source: { 
    type: String, 
    enum: ['manual', 'ml', 'modified', 'proposed'], // ⬅️ added 'proposed'
    default: 'manual' 
  },
  status: { 
    type: String, 
    enum: ['approved', 'pending', 'rejected'], 
    default: 'approved' 
  },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mlModelUsed: { type: mongoose.Schema.Types.ObjectId, ref: 'MLModel' },
  confidenceScore: Number,

  // ✅ New fields for proposed thresholds:
  pH: {
    min: Number,
    max: Number
  },
  moisture: {
    min: Number,
    max: Number
  },
  nitrogen: {
    min: Number,
    max: Number
  },
  phosphorus: {
    min: Number,
    max: Number
  },
  potassium: {
    min: Number,
    max: Number
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
