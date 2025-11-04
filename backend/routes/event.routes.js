import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  createEvent,
  getMyEvents,
  updateEventStatus,
  deleteEvent,
  getMySwappableEvents,
} from '../controllers/event.controller.js';

const router = express.Router();

router.route('/')
  .post(protect, createEvent)
  .get(protect, getMyEvents);
  
router.get('/swappable', protect, getMySwappableEvents);

router.route('/:id')
  .delete(protect, deleteEvent)
  .put(protect, updateEventStatus); // Simplified: PUT updates status

export default router;