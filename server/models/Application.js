import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverLetter: {
    type: String,
    required: [true, 'Please provide a cover letter']
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a user can only apply once to a job
applicationSchema.index({ job: 1, user: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);