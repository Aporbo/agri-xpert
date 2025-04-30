const SoilTest = require('../models/SoilTest');

// Submit Soil Test
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
    res.status(201).json({ message: 'Soil Test submitted successfully', soilTest });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to submit soil test' });
  }
};
