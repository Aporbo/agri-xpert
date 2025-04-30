const WeatherData = require('../models/WeatherData');
const IrrigationPlan = require('../models/IrrigationPlan');

// Get latest weather data
exports.getWeather = async (req, res) => {
  try {
    const weather = await WeatherData.find().sort({ timestamp: -1 }).limit(5);
    res.json(weather);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
};

// Get irrigation plans
exports.getIrrigationPlans = async (req, res) => {
  try {
    const plans = await IrrigationPlan.find().sort({ createdOn: -1 });
    res.json(plans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch irrigation plans' });
  }
};

// researcherController.js
exports.getSoilInsights = async (req, res) => {
  const data = await SoilTest.aggregate([
    { $group: { _id: "$soilType", count: { $sum: 1 }, avgPH: { $avg: "$pH" } } }
  ]);
  res.json(data);
};

exports.getRecommendationTrends = async (req, res) => {
  const trends = await Recommendation.aggregate([
    { $group: { _id: "$cropSuggestion", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  res.json(trends);
};

exports.getRuleAudit = async (req, res) => {
  const rule = await SoilRule.findOne().lean();
  res.json(rule || {});
};
