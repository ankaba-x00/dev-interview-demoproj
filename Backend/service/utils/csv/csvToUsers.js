const scanFile = require("./scanFile");
const parseCsv = require("./parseCsv");
const validateRow = require("./validateRow");
const { normalizeName, normalizeLocation } = require("./sanitizeValues");

/**
 * Import pipeline
 * 1. Virus scan
 * 2. Parse data
 * 3. Validate rows
 * 3.1. Sanitize values
 * 3.2. Reject partial uploads 
 * 3.3 enforse uniqueness within CSV 
*/

async function csvToUsers(fileBuffer) {
  // STEP 1 : scan file
  const cleanFile = await scanFile(fileBuffer);
  if (!cleanFile) {
    throw new Error("File rejected: virus scan failed");
  }

  // STEP 2 : parse file
  const csvString = fileBuffer.toString("utf-8");
  const rows = parseCsv(csvString);
  if (!rows.length) {
    throw new Error("File rejected: empty file")
  }
  
  // STEP 3 : validate row
  const users = [];
  const errors = [];
  const emails = new Set();

  rows.forEach((row, index) => {
    // validate and sanitize values
    const user = {
      name: normalizeName(row.name),
      email: row.email?.trim().toLowerCase(),
      location: normalizeLocation(row.location),
      isActive: row.isActive === "true" || row.isActive === true,
    };
    const valError = validateRow(user, index);
    if (valError) {
      errors.push(valError);
      return;
    }

    // enforce uniqueness
    if (emails.has(user.email)) {
      errors.push({
        row: index + 1,
        errors: ["duplicate email in CSV"],
      });
      return;
    }

    emails.add(user.email);
    users.push(user);
  });

  // reject partial uploads
  if (errors.length) {
    const err = new Error("Data rejected: validation failed");
    err.details = errors;
    throw err;
  }

  return users;
}

module.exports = csvToUsers;
