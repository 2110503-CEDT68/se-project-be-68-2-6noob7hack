const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  room: {
    type: mongoose.Schema.ObjectId,
    ref: 'Room',
    required: true,
    index: true
  },

  timeSlots: [
  {
    type: mongoose.Schema.ObjectId,
    ref: 'TimeSlot',
    required: true
  }
],

  // 🔥 Snapshot (VERY IMPORTANT for historical accuracy)
  roomSnapshot: {
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    capacity: {
      type: Number,
      required: true
    }
  },

  status: {
    type: String,
    enum: ['pending', 'success', 'cancelled'],
    default: 'pending',
    index: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

}, {
  timestamps: true // ✅ adds createdAt + updatedAt automatically
});

// ⚡ Compound index (optimized for queries)
ReservationSchema.index({
  user: 1,
  status: 1
});

module.exports = mongoose.model('Reservation', ReservationSchema);