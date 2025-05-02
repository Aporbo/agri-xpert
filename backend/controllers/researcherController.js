const WeatherData = require('../models/WeatherData');
const IrrigationPlan = require('../models/IrrigationPlan');
const Recommendation = require('../models/Recommendation');
const SoilRule = require('../models/SoilRule');

// ===============================
// WEATHER
// ===============================

exports.getWeather = async (req, res) => {
  try {
    const weather = await WeatherData.find().sort({ timestamp: -1 }).limit(5);
    res.json(weather);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
};

// ===============================
// IRRIGATION PLANS
// ===============================

exports.getIrrigationPlans = async (req, res) => {
  try {
    const plans = await IrrigationPlan.find().sort({ createdOn: -1 });
    res.json(plans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch irrigation plans' });
  }
};

// ===============================
// SOIL INSIGHTS (Aggregation)
// ===============================

exports.getSoilInsights = async (req, res) => {
  try {
    const data = await SoilTest.aggregate([
      {
        $group: {
          _id: "$soilType",
          count: { $sum: 1 },
          avgPH: { $avg: "$pH" },
          avgMoisture: { $avg: "$moisture" },
          avgNitrogen: { $avg: "$nitrogen" },
          avgPhosphorus: { $avg: "$phosphorus" },
          avgPotassium: { $avg: "$potassium" }
        }
      }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch soil insights' });
  }
};

// ===============================
// RECOMMENDATION TRENDS
// ===============================

exports.getRecommendationTrends = async (req, res) => {
  try {
    const trends = await Recommendation.aggregate([
      {
        $group: {
          _id: "$cropSuggestion",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    res.json(trends);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recommendation trends' });
  }
};

// ===============================
// SOIL RULE AUDIT
// ===============================

exports.getRuleAudit = async (req, res) => {
  try {
    const rules = await SoilRule.find({ status: 'APPROVED' }); // fetch all approved rules
    res.json(rules);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch soil rules' });
  }
};


// In researcherController.js
exports.proposeRules = async (req, res) => {
  try {
    const {
      soilType,
      pH,
      moisture,
      nitrogen,
      phosphorus,
      potassium,
      cropRecommendation,
      fertilizerRecommendation
    } = req.body;

    // Validate all required fields
    if (!soilType || !pH || !moisture || !nitrogen || !phosphorus || !potassium || 
        !cropRecommendation || !fertilizerRecommendation) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new rule
    const newRule = new SoilRule({
      soilType,
      pH: {
        min: parseFloat(pH.min),
        max: parseFloat(pH.max)
      },
      moisture: {
        min: parseFloat(moisture.min),
        max: parseFloat(moisture.max)
      },
      nitrogen: {
        min: parseFloat(nitrogen.min),
        max: parseFloat(nitrogen.max)
      },
      phosphorus: {
        min: parseFloat(phosphorus.min),
        max: parseFloat(phosphorus.max)
      },
      potassium: {
        min: parseFloat(potassium.min),
        max: parseFloat(potassium.max)
      },
      cropSuggestion: cropRecommendation,
      fertilizerSuggestion: fertilizerRecommendation,
      status: 'PENDING',
      createdBy: req.user.id,  // Make sure auth middleware is setting req.user
      updatedOn: new Date()
    });

    // Save to database
    const savedRule = await newRule.save();
    console.log('Rule saved:', savedRule);  // Debug logging

    return res.status(201).json({
      success: true,
      message: 'Rule proposal submitted successfully',
      rule: savedRule
    });

  } catch (err) {
    console.error('Error saving rule proposal:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to save rule proposal',
      error: err.message
    });
  }
};
const SoilTest = require('../models/SoilTest');

// GET all soil tests (for researcher to review/update)
exports.getAllSoilTests = async (req, res) => {
  try {
    const tests = await SoilTest.find().populate('user', 'name email');
    res.json(tests);
  } catch (err) {
    console.error('Error fetching soil tests:', err);
    res.status(500).json({ message: 'Failed to fetch soil tests' });
  }
};

// PUT update a soil test manually
exports.updateSoilTest = async (req, res) => {
  try {
    const updated = await SoilTest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update soil test' });
  }
};
