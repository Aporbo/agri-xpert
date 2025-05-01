const mongoose = require('mongoose');

const soilRuleSchema = new mongoose.Schema({
  soilType: { type: String, required: true },
  pH: { min: Number, max: Number },
  moisture: { min: Number, max: Number },
  nitrogen: { min: Number, max: Number },
  phosphorus: { min: Number, max: Number },
  potassium: { min: Number, max: Number },
  cropSuggestion: String,
  fertilizerSuggestion: String,
  irrigationRecommendation: String,
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedOn: { type: Date, default: Date.now }
}, { strict: true });

module.exports = mongoose.model('SoilRule', soilRuleSchema);
