const mongoose = require('mongoose');

const soilRuleSchema = new mongoose.Schema({
  minPh: Number,
  maxPh: Number,
  minMoisture: Number,
  maxMoisture: Number,
  nitrogenRange: { type: [Number], default: [0, 100] },
  phosphorusRange: { type: [Number], default: [0, 100] },
  potassiumRange: { type: [Number], default: [0, 100] },
  updatedOn: { type: Date, default: Date.now }
});

// ✅ Check if model already exists before creating
module.exports = mongoose.models.SoilRule || mongoose.model('SoilRule', soilRuleSchema);
