const express = require('express');
const router = express.Router();

const {
  createRoom,
  getRooms,
  getRoomAvailability,
  updateRoom,
  deleteRoom
} = require('../controllers/rooms');

const { protect } = require('../middleware/auth');

// 🔥 IMPORTANT: put this BEFORE /:id
router.get('/availability', getRoomAvailability);

// GET all rooms / CREATE room
router.route('/')
  .get(getRooms)
  .post(protect, createRoom);

// UPDATE / DELETE room
router.route('/:id')
  .put(protect, updateRoom)
  .delete(protect, deleteRoom);

module.exports = router;