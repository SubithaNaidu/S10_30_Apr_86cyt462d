import Application from '../models/Application.js';
import Job from '../models/Job.js';

// @desc    Create new application
// @route   POST /api/applications
// @access  Private (Job Seeker only)
export const createApplication = async (req, res, next) => {
  try {
    const { job, coverLetter } = req.body;
    
    // Check if job exists
    const jobExists = await Job.findById(job);
    
    if (!jobExists) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Check if user already applied to this job
    const existingApplication = await Application.findOne({
      job,
      user: req.user.id
    });
    
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }
    
    // Create application
    const application = await Application.create({
      job,
      user: req.user.id,
      coverLetter
    });
    
    res.status(201).json({
      success: true,
      application
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user applications
// @route   GET /api/applications/me
// @access  Private (Job Seeker only)
export const getUserApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ user: req.user.id })
      .populate({
        path: 'job',
        select: 'title company location'
      })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get job applications (for employer)
// @route   GET /api/applications/job/:id
// @access  Private (Employer only)
export const getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Make sure user is job owner
    if (job.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these applications'
      });
    }
    
    const applications = await Application.find({ job: req.params.id })
      .populate({
        path: 'user',
        select: 'name email'
      })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: applications.length,
      job,
      applications
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private (Employer only)
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'reviewing', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    let application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Get job to check ownership
    const job = await Job.findById(application.job);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Make sure user is job owner
    if (job.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }
    
    application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      application
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Check if user has already applied to a job
// @route   GET /api/applications/check/:jobId
// @access  Private (Job Seeker only)
export const checkApplicationStatus = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      job: req.params.jobId,
      user: req.user.id
    });
    
    res.status(200).json({
      success: true,
      applied: !!application
    });
  } catch (err) {
    next(err);
  }
};