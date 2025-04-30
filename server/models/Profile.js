import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: {
    type: String,
    required: [true, 'Please provide a bio'],
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  skills: {
    type: [String],
    required: [true, 'Please provide at least one skill']
  },
  location: {
    type: String,
    required: [true, 'Please provide a location']
  },
  website: {
    type: String
  },
  phone: {
    type: String
  },
  resumeUrl: {
    type: String
  },
  experience: {
    type: String,
    required: [true, 'Please provide your experience']
  },
  education: {
    type: String,
    required: [true, 'Please provide your education']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Profile', profileSchema);