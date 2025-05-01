const Report = require('../models/Report');
const SoilTest = require('../models/SoilTest');
const Recommendation = require('../models/Recommendation');
const { generateReportPDF } = require('../services/reportService');
const path = require('path');

// Generate PDF report
exports.generateReport = async (req, res) => {
  try {
    const { soilTestId } = req.params;

    const soilTest = await SoilTest.findById(soilTestId);
    const recommendation = await Recommendation.findOne({ soilTest: soilTestId });

    if (!soilTest || !recommendation) {
      return res.status(404).json({ message: 'Soil test or recommendation not found' });
    }

    const filename = `report_${soilTestId}.pdf`;
    const outputPath = path.join(__dirname, `../reports/${filename}`);

    generateReportPDF(soilTest, recommendation, outputPath);

    const report = new Report({
      reportUrl: `/reports/${filename}`,
      createdBy: req.user.id,
      createdOn: new Date()
    });

    await report.save();
    res.status(201).json({ message: 'Report generated', report });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate report' });
  }
};

// Get all reports
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdOn: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
};
