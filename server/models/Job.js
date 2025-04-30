import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a job title'],
    trim: true,
    maxlength: [100, 'Job title cannot be more than 100 characters']
  },
  company: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Please provide a location']
  },
  jobType: {
    type: String,
    required: [true, 'Please provide a job type'],
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']
  },
  description: {
    type: String,
    required: [true, 'Please provide a job description']
  },
  requirements: {
    type: String,
    required: [true, 'Please provide job requirements']
  },
  responsibilities: {
    type: String,
    required: [true, 'Please provide job responsibilities']
  },
  salary: {
    type: String,
    required: [true, 'Please provide a salary range']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add text index for search functionality
jobSchema.index({
  title: 'text',
  company: 'text',
  description: 'text',
  requirements: 'text',
  responsibilities: 'text'
});

export default mongoose.model('Job', jobSchema);