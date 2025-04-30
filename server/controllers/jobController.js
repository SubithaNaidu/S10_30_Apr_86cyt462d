import Job from '../models/Job.js';

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res, next) => {
  try {
    // Build query
    const queryObj = {};
    
    // Search functionality
    if (req.query.search) {
      queryObj.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { company: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Filter by location
    if (req.query.location) {
      queryObj.location = { $regex: req.query.location, $options: 'i' };
    }
    
    // Filter by job type
    if (req.query.jobType) {
      queryObj.jobType = req.query.jobType;
    }
    
    // Filter by salary range
    if (req.query.salary) {
      const [min, max] = req.query.salary.split('-').map(Number);
      if (min && max) {
        queryObj.salary = { $gte: min, $lte: max };
      } else if (min) {
        queryObj.salary = { $gte: min };
      } else if (max) {
        queryObj.salary = { $lte: max };
      }
    }
    
    // Filter by user ID (for employer to see their own job posts)
    if (req.query.userId) {
      queryObj.user = req.query.userId;
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Execute query with sorting
    const totalJobs = await Job.countDocuments(queryObj);
    const jobs = await Job.find(queryObj)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('user', 'name email');
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      totalPages: Math.ceil(totalJobs / limit),
      currentPage: page,
      jobs
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('user', 'name email');
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    res.status(200).json({
      success: true,
      job
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Employer only)
export const createJob = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    
    const job = await Job.create(req.body);
    
    res.status(201).json({
      success: true,
      job
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Employer only)
export const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);
    
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
        message: 'Not authorized to update this job'
      });
    }
    
    job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name email');
    
    res.status(200).json({
      success: true,
      job
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer only)
export const deleteJob = async (req, res, next) => {
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
        message: 'Not authorized to delete this job'
      });
    }
    
    await job.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};