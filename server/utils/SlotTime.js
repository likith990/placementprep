
export function getEndTime(slot) {
  const start = new Date(slot.starttime);
  return new Date(start.getTime() + slot.duration * 60000);
}

export function isSlotPast(slot) {
  return getEndTime(slot).getTime() <= Date.now();
}