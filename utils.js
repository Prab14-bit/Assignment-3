export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

export function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
