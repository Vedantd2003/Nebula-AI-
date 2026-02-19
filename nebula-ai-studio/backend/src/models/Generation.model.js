import mongoose from 'mongoose';

const generationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['text', 'image', 'analysis', 'summary'],
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  response: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  metadata: {
    model: String,
    tokens: Number,
    duration: Number,
    cost: Number
  },
  credits: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  error: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
generationSchema.index({ user: 1, createdAt: -1 });
generationSchema.index({ type: 1 });
generationSchema.index({ status: 1 });

// Static method to get user statistics
generationSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalCredits: { $sum: '$credits' }
      }
    }
  ]);
  
  return stats;
};

const Generation = mongoose.model('Generation', generationSchema);

export default Generation;
