const mongoose = require('mongoose');

const soilRuleSchema = new mongoose.Schema({
  soilType: { 
    type: String, 
    required: true 
  },
  pH: { 
    min: { type: Number, required: true }, 
    max: { type: Number, required: true } 
  },
  moisture: { 
    min: { type: Number, required: true }, 
    max: { type: Number, required: true } 
  },
  nitrogen: { 
    min: { type: Number, required: true }, 
    max: { type: Number, required: true } 
  },
  phosphorus: { 
    min: { type: Number, required: true }, 
    max: { type: Number, required: true } 
  },
  potassium: { 
    min: { type: Number, required: true }, 
    max: { type: Number, required: true } 
  },
  cropSuggestion: { 
    type: String, 
    required: true 
  },
  fertilizerSuggestion: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'REJECTED'], 
    default: 'PENDING',
    required: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedOn: { 
    type: Date, 
    default: Date.now,
    required: true 
  }
}, { 
  timestamps: true,
  strict: true 
});

// Indexes for better query performance
soilRuleSchema.index({ soilType: 1, status: 1 });
soilRuleSchema.index({ createdBy: 1 });
soilRuleSchema.index({ reviewedBy: 1 });
soilRuleSchema.index({ updatedOn: -1 });

// Virtual for formatted rule display
soilRuleSchema.virtual('displayName').get(function() {
  return `${this.soilType} (${this.cropSuggestion}) - ${this.status}`;
});

// Middleware to update updatedOn timestamp before saving
soilRuleSchema.pre('save', function(next) {
  this.updatedOn = new Date();
  next();
});

module.exports = mongoose.model('SoilRule', soilRuleSchema);