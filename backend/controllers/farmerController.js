const SoilTest = require('../models/SoilTest');
const Recommendation = require('../models/Recommendation');
const WeatherData = require('../models/WeatherData');

// Submit Soil Test
const SoilRule = require('../models/SoilRule');

exports.submitSoilTest = async (req, res) => {
  try {
    const { soilType, pH, moisture, nitrogen, phosphorus, potassium } = req.body;

    const soilTest = new SoilTest({
      user: req.user.id,
      soilType,
      pH,
      moisture,
      nitrogen,
      phosphorus,
      potassium
    });

    await soilTest.save();

    // Check against rules
    const rules = await SoilRule.findOne();
    if (rules) {
      const recommendation = new Recommendation({
        soilTest: soilTest._id,
        cropRecommendation: rules.crop || 'N/A',
        fertilizerRecommendation: rules.fertilizer || 'N/A',
        irrigationRecommendation: rules.irrigation || 'Check moisture level',
        generatedBy: req.user.id
      });

      await recommendation.save();
    }

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
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch soil tests' });
  }
};

// Get Live Weather (Dummy for now - later we use real API)
exports.getWeather = async (req, res) => {
  try {
    // For now let's return last saved weather data
    const latestWeather = await WeatherData.findOne().sort({ timestamp: -1 });

    if (!latestWeather) {
      return res.status(404).json({ message: 'No weather data available' });
    }

    res.json(latestWeather);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
};

// Get Recommendation for a Soil Test
exports.getRecommendation = async (req, res) => {
  try {
    const recommendation = await Recommendation.findOne({ soilTest: req.params.soilTestId });

    if (!recommendation) {
      return res.status(404).json({ message: 'No recommendation found for this soil test' });
    }

    res.json(recommendation);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch recommendation' });
  }
};
