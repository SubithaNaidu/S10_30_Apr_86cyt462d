import Profile from '../models/Profile.js';

// @desc    Get current user's profile
// @route   GET /api/profile/me
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    res.status(200).json({
      success: true,
      profile
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create user profile
// @route   POST /api/profile
// @access  Private
export const createProfile = async (req, res, next) => {
  try {
    // Check if profile already exists
    const existingProfile = await Profile.findOne({ user: req.user.id });
    
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Profile already exists. Use PUT to update.'
      });
    }
    
    // Add user to request body
    req.body.user = req.user.id;
    
    const profile = await Profile.create(req.body);
    
    res.status(201).json({
      success: true,
      profile
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Use POST to create a new profile.'
      });
    }
    
    profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      profile
    });
  } catch (err) {
    next(err);
  }
};