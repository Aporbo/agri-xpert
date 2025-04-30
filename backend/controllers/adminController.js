const SoilTest = require('../models/SoilTest');
const Recommendation = require('../models/Recommendation');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const SoilRule = require('../models/SoilRule');

// View All Soil Tests
exports.getAllSoilTests = async (req, res) => {
  try {
    const soilTests = await SoilTest.find().populate('user', 'name email');
    res.json(soilTests);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch soil tests' });
  }
};

// Create Recommendation for a Soil Test
exports.createRecommendation = async (req, res) => {
  try {
    const { cropSuggestion, fertilizerSuggestion } = req.body;
    const { soilTestId } = req.params;

    const existingRecommendation = await Recommendation.findOne({ soilTest: soilTestId });

    if (existingRecommendation) {
      return res.status(400).json({ message: 'Recommendation already exists for this soil test' });
    }

    const recommendation = new Recommendation({
      soilTest: soilTestId,
      cropSuggestion,
      fertilizerSuggestion,
      generatedBy: req.user.id,
    });

    await recommendation.save();
    res.status(201).json({ message: 'Recommendation created successfully', recommendation });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create recommendation' });
  }
};

exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  };
  exports.createUser = async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
  
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ message: 'User already exists' });
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = new User({ name, email, password: hashedPassword, role });
      await user.save();
  
      res.status(201).json({ message: 'User created successfully' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create user' });
    }
  };
  exports.updateUser = async (req, res) => {
    try {
      const updates = req.body;
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }
  
      const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
      res.json(updatedUser);
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update user' });
    }
  };
  exports.deleteUser = async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to delete user' });
    }
  };


// Set rule
exports.setRules = async (req, res) => {
    try {
      const rule = await SoilRule.findOne();
      if (rule) {
        await SoilRule.updateOne({}, req.body);
      } else {
        await new SoilRule(req.body).save();
      }
      res.json({ message: 'Rules updated' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update rules' });
    }
  };
  
  // Get rule
  exports.getRules = async (req, res) => {
    try {
      const rule = await SoilRule.findOne();
      res.json(rule || {});
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch rules' });
    }
  };
  
