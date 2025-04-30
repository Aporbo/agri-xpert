const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  soilTest: { type: mongoose.Schema.Types.ObjectId, ref: 'SoilTest', required: true },
  cropSuggestion: { type: String, required: true },
  fertilizerSuggestion: { type: String, required: true },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Admin
  createdOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
