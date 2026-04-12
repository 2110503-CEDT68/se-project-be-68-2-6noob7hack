const TimeSlot = require('../models/TimeSlot');

/**
 * Auto-generate 1-hour time slots for a room on a given date,
 * based on the coworking space's openTime / closeTime.
 *
 * Slots that already exist in the DB are skipped (upsert-safe).
 *
 * @param {ObjectId|string} roomId
 * @param {string} dateStr   – "YYYY-MM-DD"
 * @param {string} openTime  – "HH:MM"  e.g. "08:00"
 * @param {string} closeTime – "HH:MM"  e.g. "20:00"
 * @returns {Promise<TimeSlot[]>}  all slots for that room/day (existing + newly created)
 */
async function generateDailySlots(roomId, dateStr, openTime = '08:00', closeTime = '20:00') {
  const [openHour, openMin]   = openTime.split(':').map(Number);
  const [closeHour, closeMin] = closeTime.split(':').map(Number);

  const startOfDay = new Date(dateStr);
  const endOfDay   = new Date(dateStr);
  startOfDay.setHours(0, 0, 0, 0);
  endOfDay.setHours(23, 59, 59, 999);

  // Fetch slots that already exist for this room on this day
  const existing = await TimeSlot.find({
    room: roomId,
    startTime: { $gte: startOfDay, $lte: endOfDay }
  });

  const existingStarts = new Set(
    existing.map(s => new Date(s.startTime).getTime())
  );

  const toCreate = [];

  // Walk hour-by-hour from openTime → closeTime
  let cursor = new Date(dateStr);
  cursor.setHours(openHour, openMin, 0, 0);

  const closeDate = new Date(dateStr);
  closeDate.setHours(closeHour, closeMin, 0, 0);

  while (cursor < closeDate) {
    const slotStart = new Date(cursor);
    const slotEnd   = new Date(cursor);
    slotEnd.setHours(slotEnd.getHours() + 1);

    if (slotEnd > closeDate) break; // don't exceed closing time

    if (!existingStarts.has(slotStart.getTime())) {
      toCreate.push({ room: roomId, startTime: slotStart, endTime: slotEnd });
    }

    cursor.setHours(cursor.getHours() + 1);
  }

  if (toCreate.length > 0) {
    await TimeSlot.insertMany(toCreate, { ordered: false });
  }

  // Return the full set of slots for this room/day
  return TimeSlot.find({
    room: roomId,
    startTime: { $gte: startOfDay, $lte: endOfDay }
  }).sort({ startTime: 1 });
}

module.exports = { generateDailySlots };
