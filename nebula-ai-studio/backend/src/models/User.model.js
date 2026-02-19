import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: null
  },
  subscription: {
    tier: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: null
    }
  },
  credits: {
    total: {
      type: Number,
      default: 100
    },
    used: {
      type: Number,
      default: 0
    },
    remaining: {
      type: Number,
      default: 100
    }
  },
  usage: {
    totalRequests: {
      type: Number,
      default: 0
    },
    lastRequestAt: {
      type: Date,
      default: null
    }
  },
  refreshToken: {
    type: String,
    select: false
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
userSchema.index({ 'subscription.tier': 1 });

// Virtual for full name
userSchema.virtual('fullInfo').get(function() {
  return {
    name: this.name,
    email: this.email,
    tier: this.subscription.tier,
    credits: this.credits.remaining
  };
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }
  
  next();
});

// Update remaining credits before saving
userSchema.pre('save', function(next) {
  this.credits.remaining = this.credits.total - this.credits.used;
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Method to check if user has enough credits
userSchema.methods.hasCredits = function(amount = 1) {
  return this.credits.remaining >= amount;
};

// Method to deduct credits
userSchema.methods.deductCredits = async function(amount = 1) {
  if (!this.hasCredits(amount)) {
    throw new Error('Insufficient credits');
  }
  
  this.credits.used += amount;
  this.credits.remaining = this.credits.total - this.credits.used;
  this.usage.totalRequests += 1;
  this.usage.lastRequestAt = new Date();
  
  await this.save();
  return this.credits;
};

// Method to add credits
userSchema.methods.addCredits = async function(amount) {
  this.credits.total += amount;
  this.credits.remaining = this.credits.total - this.credits.used;
  await this.save();
  return this.credits;
};

const User = mongoose.model('User', userSchema);

export default User;
