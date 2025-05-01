const SoilTest = require('../models/SoilTest');
const Recommendation = require('../models/Recommendation');
const User = require('../models/User');
const SoilRule = require('../models/SoilRule');
const bcrypt = require('bcrypt');

// Get All Soil Tests + Linked Recommendations
exports.getAllSoilTests = async (req, res) => {
  try {
    const tests = await SoilTest.find().populate('user', 'name email').lean();
    const recommendations = await Recommendation.find().lean();

    const enriched = tests.map(test => {
      const recommendation = recommendations.find(r =>
        String(r.soilTest) === String(test._id)
      );
      return { ...test, recommendation: recommendation || null };
    });

    res.json(enriched);
  } catch (error) {
    console.error('[Admin] Fetch Soil Tests Error:', error);
    res.status(500).json({ message: 'Failed to fetch soil tests' });
  }
};

// User CRUD
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const updated = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// Recommendation creation
exports.createRecommendation = async (req, res) => {
  try {
    const { soilTestId } = req.params;
    const { cropSuggestion, fertilizerSuggestion } = req.body;

    const exists = await Recommendation.findOne({ soilTest: soilTestId });
    if (exists) return res.status(400).json({ message: 'Already exists' });

    const rec = new Recommendation({
      soilTest: soilTestId,
      cropSuggestion,
      fertilizerSuggestion,
      generatedBy: req.user.id,
    });

    await rec.save();
    res.status(201).json({ message: 'Recommendation created', rec });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create recommendation' });
  }
};

// Rules
exports.setRules = async (req, res) => {
  try {
    const exists = await SoilRule.findOne();
    if (exists) await SoilRule.updateOne({}, req.body);
    else await new SoilRule(req.body).save();
    res.json({ message: 'Rules updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update rules' });
  }
};

exports.getRules = async (req, res) => {
  try {
    const rules = await SoilRule.findOne();
    res.json(rules || {});
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch rules' });
  }
};
