const Papa = require("papaparse");

function normalizeHeader(header) {
  const normalized = header
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");

  const suffix = normalized.slice(-4);

  switch (suffix) {
    case "ress":
      return "ipAddress";
    case "ogin":
      return "lastLogin";
    case "tive":
      return "isActive";
    default:
      return normalized;
  }
}

function parseCsv(csvString) {
  const { data, errors } = Papa.parse(csvString, {
    header: true,
    skipEmptyLines: true,
    transformHeader: normalizeHeader,
  });

  if (errors.length) {
    const err = new Error("CSV parsing failed");
    err.details = errors;
    throw err;
  }

  return data;
}

module.exports = parseCsv;
