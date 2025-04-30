const mongoose = require('mongoose');

const irrigationPlanSchema = new mongoose.Schema({
  irrigationAdvice: { type: String, required: true },
  createdOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('IrrigationPlan', irrigationPlanSchema);
