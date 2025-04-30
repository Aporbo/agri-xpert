const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportUrl: { type: String, required: true }, // Assume stored file URL
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Govt Official
  createdOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
