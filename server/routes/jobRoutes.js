import express from 'express';
import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getJobs)
  .post(protect, authorize('employer'), createJob);

router.route('/:id')
  .get(getJob)
  .put(protect, authorize('employer'), updateJob)
  .delete(protect, authorize('employer'), deleteJob);

export default router;