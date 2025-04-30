import express from 'express';
import {
  createApplication,
  getUserApplications,
  getJobApplications,
  updateApplicationStatus,
  checkApplicationStatus
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('jobseeker'), createApplication);

router.route('/me')
  .get(protect, authorize('jobseeker'), getUserApplications);

router.route('/job/:id')
  .get(protect, authorize('employer'), getJobApplications);

router.route('/check/:jobId')
  .get(protect, authorize('jobseeker'), checkApplicationStatus);

router.route('/:id')
  .put(protect, authorize('employer'), updateApplicationStatus);

export default router;