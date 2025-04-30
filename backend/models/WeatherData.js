const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema({
  location: { type: String, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  precipitation: { type: Number, required: true },
  windSpeed: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WeatherData', weatherDataSchema);
