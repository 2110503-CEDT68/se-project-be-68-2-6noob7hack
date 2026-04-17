const express = require('express');
const router = express.Router();

const {
  getCoworkingspaces,
  getCoworkingspace,
  createCoworkingspace,
  updateCoworkingspace,
  deleteCoworkingspace,
  updateCoworkingspacePhoto
} = require('../controllers/coworkingspaces');

// ✅ Import the new room functions
const { getRoomsByCoworking, getRoomByCoworking } = require('../controllers/rooms');

const { protect } = require('../middleware/auth');

router.route('/')
  .get(getCoworkingspaces)
  .post(protect, createCoworkingspace);

router.route('/:id')
  .get(getCoworkingspace)
  .put(protect, updateCoworkingspace)
  .delete(protect, deleteCoworkingspace);

router.route('/:id/photo')
  .put(protect, updateCoworkingspacePhoto);

// ✅ Nested room routes
router.get('/:coworkingId/rooms', getRoomsByCoworking);
router.get('/:coworkingId/rooms/:roomId', getRoomByCoworking);

module.exports = router;