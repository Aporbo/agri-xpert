const Report = require('../models/Report');
const SoilTest = require('../models/SoilTest');
const Recommendation = require('../models/Recommendation');

// Get all reports
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdOn: -1 });
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
};

// Generate a new report for a soil test
exports.generateReport = async (req, res) => {
  try {
    const { soilTestId } = req.params;

    const soilTest = await SoilTest.findById(soilTestId);
    const recommendation = await Recommendation.findOne({ soilTest: soilTestId });

    if (!soilTest || !recommendation) {
      return res.status(404).json({ message: 'Soil test or recommendation not found' });
    }

    const content = `
      Soil Report:
      ---------------------
      pH: ${soilTest.pH}
      Moisture: ${soilTest.moisture}
      N: ${soilTest.nitrogen}
      P: ${soilTest.phosphorus}
      K: ${soilTest.potassium}
      Soil Type: ${soilTest.soilType}

      Recommendation:
      Crop: ${recommendation.cropSuggestion}
      Fertilizer: ${recommendation.fertilizerSuggestion}
    `;

    const report = new Report({
      reportUrl: `Generated Inline Content`, // Replace with real PDF URL if generating
      createdBy: req.user.id,
      createdOn: new Date()
    });

    await report.save();
    res.status(201).json({ message: 'Report generated successfully', report });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate report' });
  }
};
