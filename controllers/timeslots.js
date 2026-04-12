const TimeSlot = require('../models/TimeSlot');

// CREATE SLOT
exports.createTimeSlot = async (req, res) => {
  const { room, startTime, endTime } = req.body;

  const overlap = await TimeSlot.findOne({
    room,
    startTime: { $lt: endTime },
    endTime: { $gt: startTime }
  });

  if (overlap) {
    return res.status(400).json({ message: "Time slot overlaps" });
  }

  const slot = await TimeSlot.create(req.body);

  res.status(201).json({ success: true, data: slot });
};

// GET SLOTS
exports.getTimeSlots = async (req, res) => {
  const slots = await TimeSlot.find({
    room: req.params.roomId
  });

  res.status(200).json({ success: true, data: slots });
};