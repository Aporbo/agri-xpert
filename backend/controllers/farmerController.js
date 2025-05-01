const SoilTest = require('../models/SoilTest');
const Recommendation = require('../models/Recommendation');
const WeatherData = require('../models/WeatherData');
const SoilRule = require('../models/SoilRule');
const { getMLRecommendation } = require('../services/mlService');
const { fetchWeatherData } = require('../services/weatherService');
const User = require('../models/User');
// Submit Soil Test (Rule-based with optional ML fallback)
exports.submitSoilTest = async (req, res) => {
  try {
    const { soilType, pH, moisture, nitrogen, phosphorus, potassium } = req.body;

    // 1. Save the soil test
    const soilTest = new SoilTest({
      user: req.user.id,
      soilType,
      pH,
      moisture,
      nitrogen,
      phosphorus,
      potassium
    });
    const rules = await SoilRule.findOne();

    await soilTest.save();

    // 2. Rule-based recommendation logic
    let crop = 'Sorghum';
    let fertilizer = 'Compost + NPK';

    if (pH >= 6 && pH <= 7.5 && nitrogen > 20 && phosphorus > 20) {
      crop = 'Wheat';
      fertilizer = 'Urea + DAP';
    } else if (moisture > 60 && phosphorus > 25 && pH < 6.8) {
      crop = 'Rice';
      fertilizer = 'Potash + SSP';
    } else if (potassium < 20 && pH < 5.5) {
      crop = 'Groundnut';
      fertilizer = 'Gypsum + Lime';
    }

    // 3. Try ML-based override (optional)
    try {
      const mlData = await getMLRecommendation(req.body);
      if (mlData?.crop) crop = mlData.crop;
      if (mlData?.fertilizer) fertilizer = mlData.fertilizer;
    } catch (mlError) {
      console.warn('ML Recommendation not available or failed:', mlError.message);
    }

    // 4. Save recommendation
    const recommendation = new Recommendation({
      soilTest: soilTest._id,
      cropSuggestion: crop,
      fertilizerSuggestion: fertilizer,
      generatedBy: req.user.id
    });

    await recommendation.save();

    res.status(201).json({ message: 'Soil Test submitted successfully', soilTest });

  } catch (error) {
    console.error('[ERROR] Submit Soil Test:', error);
    res.status(500).json({ message: 'Failed to submit soil test', error: error.message });
  }
};

// Get My Soil Tests
exports.getMySoilTests = async (req, res) => {
  try {
    const soilTests = await SoilTest.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(soilTests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch soil tests' });
  }
};

// Get Live Weather (from weatherService or last DB entry)
exports.getWeather = async (req, res) => {
  try {
    const weather = await fetchWeatherData();
    if (!weather) return res.status(404).json({ message: 'Weather data not available' });
    res.json(weather);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
};

// Get Recommendation for a Soil Test
exports.getRecommendation = async (req, res) => {
  try {
    const recommendation = await Recommendation.findOne({ soilTest: req.params.soilTestId }).populate('soilTest');
    if (!recommendation) {
      return res.status(404).json({ message: 'No recommendation found' });
    }
    res.status(200).json(recommendation);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Profile update error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

// Update Password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ message: 'Failed to update password', error: error.message });
  }
};
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

