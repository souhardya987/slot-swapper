import mongoose from 'mongoose';

const swapRequestSchema = mongoose.Schema(
  {
    // User who initiated the request
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // User who owns the desired slot
    responder: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // The slot offered by the requester
    offeredSlot: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Event',
    },
    // The slot desired from the responder
    requestedSlot: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Event',
    },
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);
export default SwapRequest;