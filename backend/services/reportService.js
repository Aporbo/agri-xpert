const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateReportPDF = (soilTest, recommendation, outputPath) => {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(outputPath));

  doc.fontSize(16).text('Soil Test Report', { underline: true });
  doc.moveDown();
  doc.text(`Soil Type: ${soilTest.soilType}`);
  doc.text(`pH: ${soilTest.pH}`);
  doc.text(`Moisture: ${soilTest.moisture}`);
  doc.text(`Nitrogen: ${soilTest.nitrogen}`);
  doc.text(`Phosphorus: ${soilTest.phosphorus}`);
  doc.text(`Potassium: ${soilTest.potassium}`);

  doc.moveDown();
  doc.fontSize(14).text('Recommendation');
  doc.text(`Crop: ${recommendation.cropSuggestion}`);
  doc.text(`Fertilizer: ${recommendation.fertilizerSuggestion}`);

  doc.end();
};

module.exports = { generateReportPDF };
