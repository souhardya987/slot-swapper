import Event from '../models/event.model.js';


export const createEvent = async (req, res) => {
  const { title, startTime, endTime } = req.body;

  const event = new Event({
    title,
    startTime,
    endTime,
    owner: req.user._id,
    status: 'BUSY',
  });

  const createdEvent = await event.save();
  res.status(201).json(createdEvent);
};


export const getMyEvents = async (req, res) => {
  const events = await Event.find({ owner: req.user._id }).sort({ startTime: 1 });
  res.json(events);
};


export const getMySwappableEvents = async (req, res) => {
  const events = await Event.find({
    owner: req.user._id,
    status: 'SWAPPABLE',
  }).sort({ startTime: 1 });
  res.json(events);
};


export const updateEventStatus = async (req, res) => {
  const { status } = req.body; // e.g., { "status": "SWAPPABLE" }

  if (!['BUSY', 'SWAPPABLE'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const event = await Event.findById(req.params.id);

  if (event.owner.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  // Prevent changing status if a swap is pending
  if (event.status === 'SWAP_PENDING') {
     return res.status(400).json({ message: 'Cannot change status during a pending swap' });
  }

  event.status = status;
  const updatedEvent = await event.save();
  res.json(updatedEvent);
};


export const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event.owner.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  
  if (event.status === 'SWAP_PENDING') {
     return res.status(400).json({ message: 'Cannot delete event during a pending swap' });
  }

  await event.deleteOne();
  res.json({ message: 'Event removed' });
};