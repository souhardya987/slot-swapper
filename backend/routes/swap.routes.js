import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getSwappableSlots,
  createSwapRequest,
  respondToSwapRequest,
  getMySwapRequests,
} from '../controllers/swap.controller.js';

const router = express.Router();

// GET /api/swap/swappable-slots
router.get('/swappable-slots', protect, getSwappableSlots);

// POST /api/swap/swap-request
router.post('/swap-request', protect, createSwapRequest);

// GET /api/swap/requests (For the notifications page)
router.get('/requests', protect, getMySwapRequests);

// POST /api/swap/swap-response/:requestId
router.post('/swap-response/:requestId', protect, respondToSwapRequest);

export default router;