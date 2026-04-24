const TimeSlot = require('../models/TimeSlot');

// Store times as local UTC+7 wall-clock values directly in UTC fields.
// The frontend reads them as-is without any timezone conversion needed.

/**
 * Create a Date where the UTC fields hold the UTC+7 local wall-clock time.
 * e.g. local 08:00 → stored as 2025-01-01T08:00:00.000Z (NOT 01:00Z)
 */
function toLocalDate(dateStr, hour, minute) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour, minute, 0, 0));
}

/**
 * Get the full "local day" range stored as UTC+7 wall-clock values.
 * e.g. 2025-01-01 → 2025-01-01T00:00:00.000Z to 2025-01-01T23:59:59.999Z
 */
function getLocalDayRange(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  const end   = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
  return { start, end };
}

async function generateDailySlots(
  roomId,
  dateStr,
  openTime  = '08:00',
  closeTime = '20:00'
) {
  const [openHour,  openMin]  = openTime.split(':').map(Number);
  const [closeHour, closeMin] = closeTime.split(':').map(Number);

  const { start: startOfDay, end: endOfDay } = getLocalDayRange(dateStr);

  // Find slots already generated for this room+day
  const existing = await TimeSlot.find({
    room:      roomId,
    startTime: { $gte: startOfDay, $lte: endOfDay }
  });

  const existingStarts = new Set(
    existing.map(s => new Date(s.startTime).getTime())
  );

  const toCreate = [];
  let cursor    = toLocalDate(dateStr, openHour,  openMin);
  const closeAt = toLocalDate(dateStr, closeHour, closeMin);

  while (cursor < closeAt) {
    const slotStart = new Date(cursor);
    const slotEnd   = new Date(cursor);
    slotEnd.setUTCHours(slotEnd.getUTCHours() + 1);

    if (slotEnd > closeAt) break;

    if (!existingStarts.has(slotStart.getTime())) {
      toCreate.push({ room: roomId, startTime: slotStart, endTime: slotEnd });
    }

    cursor.setUTCHours(cursor.getUTCHours() + 1);
  }

  if (toCreate.length > 0) {
    await TimeSlot.insertMany(toCreate, { ordered: false });
  }

  return TimeSlot.find({
    room:      roomId,
    startTime: { $gte: startOfDay, $lte: endOfDay }
  }).sort({ startTime: 1 });
}

module.exports = { generateDailySlots };