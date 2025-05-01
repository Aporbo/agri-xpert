const WeatherData = require('../models/WeatherData');
const IrrigationPlan = require('../models/IrrigationPlan');
const SoilTest = require('../models/SoilTest');
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
    const rule = await SoilRule.findOne().lean();
    res.json(rule || {});
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch soil rules' });
  }
};

exports.proposeRules = async (req, res) => {
  try {
    const {
      pH,
      moisture,
      nitrogen,
      phosphorus,
      potassium,
      cropRecommendation,
      fertilizerRecommendation
    } = req.body;

    const newRuleProposal = new Recommendation({
      pH,
      moisture,
      nitrogen,
      phosphorus,
      potassium,
      cropSuggestion: cropRecommendation,
      fertilizerSuggestion: fertilizerRecommendation,
      status: 'pending',
      source: 'proposed',
      generatedBy: req.user.id
    });
    

    await newRuleProposal.save();

    res.status(201).json({ message: 'Rule proposed and pending admin approval' });
  } catch (err) {
    console.error('Error proposing rules:', err);
    res.status(500).json({ message: 'Failed to propose new rules' });
  }
};
