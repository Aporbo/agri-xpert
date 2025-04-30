// models/SoilRule.js
const mongoose = require('mongoose');

const soilRuleSchema = new mongoose.Schema({
  pH: { min: Number, max: Number },
  moisture: { min: Number, max: Number },
  nitrogen: { min: Number, max: Number },
  phosphorus: { min: Number, max: Number },
  potassium: { min: Number, max: Number },
  cropRecommendation: String,
  fertilizerRecommendation: String,
  irrigationRecommendation: String
});

module.exports = mongoose.model('SoilRule', soilRuleSchema);
