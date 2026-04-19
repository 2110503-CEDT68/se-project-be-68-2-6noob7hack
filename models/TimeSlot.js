const mongoose = require('mongoose');

const TimeSlotSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.ObjectId,
    ref: 'Room',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  }
}, { timestamps: true });

TimeSlotSchema.index({ room: 1, startTime: 1, endTime: 1 });

module.exports = mongoose.model('TimeSlot', TimeSlotSchema);