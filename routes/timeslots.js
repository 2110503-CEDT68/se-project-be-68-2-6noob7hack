const express = require('express');
const router = express.Router();

const {
  createTimeSlot,
  getTimeSlots
} = require('../controllers/timeslots');

const { protect } = require('../middleware/auth');

router.post('/', protect, createTimeSlot);
router.get('/:roomId', getTimeSlots);

module.exports = router;