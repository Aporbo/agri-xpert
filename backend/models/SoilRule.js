const mongoose = require('mongoose');

const soilRuleSchema = new mongoose.Schema({
  pH: { min: Number, max: Number },
  moisture: { min: Number, max: Number },
  nitrogen: { min: Number, max: Number },
  phosphorus: { min: Number, max: Number },
  potassium: { min: Number, max: Number },
  cropSuggestion: String,
  fertilizerSuggestion: String,
  irrigationRecommendation: String,
  updatedOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SoilRule', soilRuleSchema);