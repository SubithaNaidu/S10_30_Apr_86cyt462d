import express from 'express';
import {
  getProfile,
  createProfile,
  updateProfile
} from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/me')
  .get(protect, getProfile);

router.route('/')
  .post(protect, createProfile)
  .put(protect, updateProfile);

export default router;