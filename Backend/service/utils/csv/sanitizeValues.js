function normalizeName(value) {
  return value
    ?.trim()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function normalizeLocation(value) {
  return value
    ?.trim()
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
}

module.exports = {
  normalizeName,
  normalizeLocation,
};
