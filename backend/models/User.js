const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['FARMER', 'ADMIN', 'RESEARCHER', 'GOVT_OFFICIAL'], 
    default: 'FARMER'
  },
  registrationDate: { type: Date, default: Date.now },
  lastLogin: { type: Date }
});

// ✅ Compare current password
userSchema.methods.comparePassword = function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

// ✅ Hash password on update if changed
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);
