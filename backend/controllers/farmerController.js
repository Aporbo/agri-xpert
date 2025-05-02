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
    
    // Create and save soil test
    const soilTest = new SoilTest({
      soilType,
      pH,
      moisture,
      nitrogen,
      phosphorus,
      potassium,
      user: req.user.id
    });
    await soilTest.save();

    // Check if this matches any approved rules
    const matchingRule = await SoilRule.findOne({
      status: 'APPROVED',
      soilType,
      'pH.min': { $lte: pH },
      'pH.max': { $gte: pH },
      'moisture.min': { $lte: moisture },
      'moisture.max': { $gte: moisture },
      'nitrogen.min': { $lte: nitrogen },
      'nitrogen.max': { $gte: nitrogen },
      'phosphorus.min': { $lte: phosphorus },
      'phosphorus.max': { $gte: phosphorus },
      'potassium.min': { $lte: potassium },
      'potassium.max': { $gte: potassium }
    });

    let recommendation;
    if (matchingRule) {
      // Create approved recommendation based on matching rule
      recommendation = new Recommendation({
        soilTest: soilTest._id,
        cropSuggestion: matchingRule.cropSuggestion,
        fertilizerSuggestion: matchingRule.fertilizerSuggestion,
        irrigationRecommendation: matchingRule.irrigationRecommendation || 'Standard irrigation',
        generatedBy: null, // System-generated
        source: 'rule',
        status: 'approved'
      });
    } else {
      // Create pending recommendation for admin review
      recommendation = new Recommendation({
        soilTest: soilTest._id,
        cropSuggestion: 'Pending admin review',
        fertilizerSuggestion: 'Pending admin review',
        irrigationRecommendation: 'Pending admin review',
        generatedBy: req.user.id,
        source: 'manual',
        status: 'pending',
        // Save the input values for reference
        pH: { min: pH, max: pH },
        moisture: { min: moisture, max: moisture },
        nitrogen: { min: nitrogen, max: nitrogen },
        phosphorus: { min: phosphorus, max: phosphorus },
        potassium: { min: potassium, max: potassium }
      });
    }

    await recommendation.save();

    res.status(201).json({
      message: matchingRule 
        ? 'Soil test submitted with automatic recommendation'
        : 'Soil test submitted for admin review',
      soilTest,
      recommendation
    });

  } catch (err) {
    console.error('Error submitting soil test:', err);
    res.status(500).json({ 
      message: 'Failed to submit soil test', 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
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

