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
    // Destructure only the fields you want
    const {
      soilType,
      pH,
      moisture,
      nitrogen,
      phosphorus,
      potassium,
      cropSuggestion,
      fertilizerSuggestion,
      irrigationRecommendation
    } = req.body;

    // Build a new rule object (no manual 'id')
    const rule = new SoilRule({
      soilType,
      pH,
      moisture,
      nitrogen,
      phosphorus,
      potassium,
      cropSuggestion,
      fertilizerSuggestion,
      irrigationRecommendation,
      status: 'APPROVED' // optional default status
    });

    await rule.save();
    res.status(201).json({ message: 'Rule added successfully', rule });
  } catch (error) {
    console.error('[Admin] Save Rule Error:', error);
    res.status(500).json({ message: 'Failed to add rule' });
  }
};



exports.getRules = async (req, res) => {
  try {
    const rules = await SoilRule.find(); // ✅ Returns all
    res.json(rules);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch rules' });
  }
};
exports.getPendingRules = async (req, res) => {
  try {
    const rules = await SoilRule.find({ status: 'PENDING' })
      .populate('createdBy', 'name email')
      .sort({ updatedOn: -1 });
      
    res.json(rules);
  } catch (err) {
    console.error('Error fetching pending rules:', err);
    res.status(500).json({ 
      message: 'Failed to fetch pending rules',
      error: err.message 
    });
  }
};

exports.reviewRuleProposal = async (req, res) => {
  try {
    const { action } = req.body;
    const validActions = ['approve', 'reject'];
    
    if (!validActions.includes(action)) {
      return res.status(400).json({ message: 'Invalid action. Must be "approve" or "reject"' });
    }

    const status = action === 'approve' ? 'APPROVED' : 'REJECTED';
    const updatedRule = await SoilRule.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        updatedOn: new Date(),
        reviewedBy: req.user.id 
      },
      { new: true }
    ).populate('createdBy', 'name email');

    if (!updatedRule) {
      return res.status(404).json({ message: 'Rule not found' });
    }

    res.json({ 
      message: `Rule ${status.toLowerCase()} successfully`,
      rule: updatedRule 
    });
  } catch (err) {
    console.error('Error reviewing rule proposal:', err);
    res.status(500).json({ 
      message: 'Failed to process rule proposal',
      error: err.message 
    });
  }
};
exports.getPendingRecommendations = async (req, res) => {
  try {
    const recommendations = await Recommendation.find({ status: 'pending' })
      .populate('soilTest')
      .populate('generatedBy', 'name email')
      .sort({ createdAt: -1 });
      
    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending recommendations', error: err.message });
  }
};

exports.reviewRecommendation = async (req, res) => {
  try {
    const { action, cropSuggestion, fertilizerSuggestion } = req.body;
    
    const recommendation = await Recommendation.findById(req.params.id);
    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }

    if (action === 'approve') {
      recommendation.status = 'approved';
      recommendation.cropSuggestion = cropSuggestion;
      recommendation.fertilizerSuggestion = fertilizerSuggestion;
      recommendation.reviewedBy = req.user.id;
      
      // Optionally create a new rule from this approval
      const newRule = new SoilRule({
        soilType: recommendation.soilTest.soilType,
        pH: recommendation.pH,
        moisture: recommendation.moisture,
        nitrogen: recommendation.nitrogen,
        phosphorus: recommendation.phosphorus,
        potassium: recommendation.potassium,
        cropSuggestion,
        fertilizerSuggestion,
        status: 'APPROVED',
        createdBy: req.user.id
      });
      await newRule.save();
    } else {
      recommendation.status = 'rejected';
      recommendation.reviewedBy = req.user.id;
    }

    await recommendation.save();
    res.json({ message: `Recommendation ${action}d`, recommendation });

  } catch (err) {
    res.status(500).json({ message: 'Failed to process recommendation', error: err.message });
  }
};


