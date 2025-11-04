import Event from '../models/event.model.js';
import SwapRequest from '../models/swapRequest.model.js';
import mongoose from 'mongoose';

// @desc    Get all swappable slots from OTHER users
// @route   GET /api/swap/swappable-slots
export const getSwappableSlots = async (req, res) => {
  const slots = await Event.find({
    status: 'SWAPPABLE',
    owner: { $ne: req.user._id }, // Exclude user's own slots
  })
    .populate('owner', 'name email') // Show who owns the slot
    .sort({ startTime: 1 });

  res.json(slots);
};

// @desc    Create a new swap request
// @route   POST /api/swap/swap-request
export const createSwapRequest = async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;

  const mySlot = await Event.findById(mySlotId);
  const theirSlot = await Event.findById(theirSlotId);

  // 1. Validation
  if (!mySlot || !theirSlot) {
    return res.status(404).json({ message: 'One or both slots not found' });
  }
  if (mySlot.owner.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized to offer this slot' });
  }
  if (theirSlot.owner.toString() === req.user._id.toString()) {
    return res.status(400).json({ message: 'Cannot swap with yourself' });
  }
  if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE') {
    return res.status(400).json({ message: 'Both slots must be SWAPPABLE' });
  }

  // 2. Create SwapRequest
  const swapRequest = new SwapRequest({
    requester: req.user._id,
    responder: theirSlot.owner,
    offeredSlot: mySlotId,
    requestedSlot: theirSlotId,
    status: 'PENDING',
  });

  // 3. Update slot statuses to SWAP_PENDING
  mySlot.status = 'SWAP_PENDING';
  theirSlot.status = 'SWAP_PENDING';

  try {
    await mySlot.save();
    await theirSlot.save();
    const createdRequest = await swapRequest.save();
    res.status(201).json(createdRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating request' });
  }
};

// @desc    Respond to an incoming swap request
// @route   POST /api/swap/swap-response/:requestId
export const respondToSwapRequest = async (req, res) => {
  const { accept } = req.body; // true or false
  const { requestId } = req.params;

  const swapRequest = await SwapRequest.findById(requestId);

  if (!swapRequest) {
    return res.status(404).json({ message: 'Swap request not found' });
  }

  // Check if logged-in user is the intended responder
  if (swapRequest.responder.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized to respond' });
  }
  
  if (swapRequest.status !== 'PENDING') {
    return res.status(400).json({ message: 'This request has already been actioned' });
  }

  const offeredSlot = await Event.findById(swapRequest.offeredSlot);
  const requestedSlot = await Event.findById(swapRequest.requestedSlot);

  if (!offeredSlot || !requestedSlot) {
    return res.status(404).json({ message: 'One or both slots in this request no longer exist' });
  }

  if (accept === false) {
    // REJECT logic
    swapRequest.status = 'REJECTED';
    offeredSlot.status = 'SWAPPABLE';
    requestedSlot.status = 'SWAPPABLE';

    await swapRequest.save();
    await offeredSlot.save();
    await requestedSlot.save();

    return res.json({ message: 'Swap rejected' });
  }

  // ACCEPT logic (The core transaction)
  // Use a transaction for atomicity
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // 1. Exchange owners
    const originalRequesterId = offeredSlot.owner;
    const originalResponderId = requestedSlot.owner;
    
    offeredSlot.owner = originalResponderId;
    requestedSlot.owner = originalRequesterId;

    // 2. Set status back to BUSY
    offeredSlot.status = 'BUSY';
    requestedSlot.status = 'BUSY';

    // 3. Mark request as ACCEPTED
    swapRequest.status = 'ACCEPTED';

    await offeredSlot.save({ session });
    await requestedSlot.save({ session });
    await swapRequest.save({ session });

    await session.commitTransaction();
    res.json({ message: 'Swap accepted successfully' });

  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: 'Transaction failed, swap not completed' });
  } finally {
    session.endSession();
  }
};

// @desc    Get user's incoming and outgoing requests
// @route   GET /api/swap/requests
export const getMySwapRequests = async (req, res) => {
  const incoming = await SwapRequest.find({
    responder: req.user._id,
    status: 'PENDING', // Only show actionable requests
  })
    .populate('requester', 'name')
    .populate('offeredSlot')
    .populate('requestedSlot');

  const outgoing = await SwapRequest.find({
    requester: req.user._id,
  })
    .populate('responder', 'name')
    .populate('offeredSlot')
    .populate('requestedSlot');
    
  res.json({ incoming, outgoing });
};