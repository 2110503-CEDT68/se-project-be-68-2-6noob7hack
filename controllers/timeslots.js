const TimeSlot = require('../models/TimeSlot');
const Room = require('../models/Room');

// CREATE SLOT
exports.createTimeSlot = async (req, res) => {
  try {
    const { room: roomId, startTime, endTime } = req.body;

    // 1️⃣ get room → coworking space
    const room = await Room.findById(roomId).populate('coworkingSpace');
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    const space = room.coworkingSpace;
    if (!space) {
      return res.status(404).json({ success: false, message: "Coworking space not found" });
    }

    // 2️⃣ parse open/close from space (stored as "HH:MM")
    const slotDate = new Date(startTime);
    const year = slotDate.getFullYear();
    const month = slotDate.getMonth();
    const day = slotDate.getDate();

    const [openHour, openMin] = space.openTime.split(':').map(Number);
    const [closeHour, closeMin] = space.closeTime.split(':').map(Number);

    const spaceOpen  = new Date(year, month, day, openHour, openMin);
    const spaceClose = new Date(year, month, day, closeHour, closeMin);
    const slotStart  = new Date(startTime);
    const slotEnd    = new Date(endTime);

    // 3️⃣ validate slot is within open hours
    if (slotStart < spaceOpen || slotEnd > spaceClose) {
      return res.status(400).json({
        success: false,
        message: `Slot must be within coworking space hours: ${space.openTime} - ${space.closeTime}`
      });
    }

    // 4️⃣ overlap check (same room)
    const overlap = await TimeSlot.findOne({
      room: roomId,
      startTime: { $lt: slotEnd },
      endTime:   { $gt: slotStart }
    });

    if (overlap) {
      return res.status(400).json({ success: false, message: "Time slot overlaps with existing slot" });
    }

    // 5️⃣ create
    const slot = await TimeSlot.create({ room: roomId, startTime, endTime });

    return res.status(201).json({ success: true, data: slot });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET SLOTS
exports.getTimeSlots = async (req, res) => {
  try {
    const slots = await TimeSlot.find({
      room: req.params.roomId
    }).sort({ startTime: 1 });

    return res.status(200).json({ success: true, count: slots.length, data: slots });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};