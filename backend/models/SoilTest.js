const mongoose = require('mongoose');

const soilTestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  soilType: { type: String, required: true },
  pH: { type: Number, required: true },
  moisture: { type: Number, required: true },
  nitrogen: { type: Number, required: true },
  phosphorus: { type: Number, required: true },
  potassium: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SoilTest', soilTestSchema);
