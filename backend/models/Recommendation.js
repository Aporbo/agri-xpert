const mongoose = require('mongoose'); // Add this import at the top

const recommendationSchema = new mongoose.Schema({
  soilTest: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SoilTest',
    required: function() {
      return this.source !== 'proposed';
    }
  },
  cropSuggestion: { 
    type: String, 
    required: true 
  },
  fertilizerSuggestion: { 
    type: String, 
    required: true 
  },
  irrigationRecommendation: {
    type: String,
    required: true
  },
  generatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  createdOn: { 
    type: Date, 
    default: Date.now 
  },
  source: { 
    type: String, 
    enum: ['manual', 'ml', 'modified', 'rule', 'proposed'], 
    default: 'manual' 
  },
  status: { 
    type: String, 
    enum: ['approved', 'pending', 'rejected'], 
    default: 'approved' 
  },
  reviewedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  
  // Soil parameter ranges
  pH: {
    min: { type: Number, min: 0, max: 14 },
    max: { type: Number, min: 0, max: 14 }
  },
  moisture: {
    min: { type: Number, min: 0 },
    max: { type: Number, min: 0 }
  },
  nitrogen: {
    min: { type: Number, min: 0 },
    max: { type: Number, min: 0 }
  },
  phosphorus: {
    min: { type: Number, min: 0 },
    max: { type: Number, min: 0 }
  },
  potassium: {
    min: { type: Number, min: 0 },
    max: { type: Number, min: 0 }
  },
  
  // Additional info
  notes: String,
  reviewNotes: String,
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for display name
recommendationSchema.virtual('displayName').get(function() {
  return `${this.cropSuggestion} (${this.status})`;
});

// Indexes for better query performance
recommendationSchema.index({ soilTest: 1 });
recommendationSchema.index({ status: 1 });
recommendationSchema.index({ generatedBy: 1 });
recommendationSchema.index({ reviewedBy: 1 });
recommendationSchema.index({ createdAt: -1 });
recommendationSchema.index({ updatedAt: -1 });

// Pre-save hook to update timestamps
recommendationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Recommendation', recommendationSchema);