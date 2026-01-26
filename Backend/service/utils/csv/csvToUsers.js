const Papa = require('papaparse');
const {
  emailRegex,
  nameRegex,
  locationRegex
} = require('../../utils/validation/regexPatterns')

/**
 * Import pipeline
 * 1. Virus scan
 * 2. Parse data
 * 3. Validate rows
 * 3.1. Sanitize values
 * 3.2. Reject partial uploads 
 * 3.3 enforse uniqueness within CSV 
*/

async function scanFile(buffer) {
  // placeholder for e.g. ClamAV
  return true;
}

function normalizeHeader(header) {
  const normalized = header
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '');

  const suffix = normalized.slice(-4);

  switch (suffix) {
    case 'ress':
      return 'ipAddress';
    case 'ogin':
      return 'lastLogin';
    case 'tive':
      return 'isActive';
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
    const err = new Error('CSV parsing failed');
    err.details = errors;
    throw err;
  }

  return data;
}

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

function validateRow(row, index) {
  const errors = [];

  if (!row.name) errors.push('name is required')
  else if (!nameRegex.test(row.name)) errors.push('name format is invalid');

  if (!row.email) errors.push('email is required')
  else if (!emailRegex.test(row.email)) errors.push('email format is invalid');

  if (!row.location) errors.push('location is required')
  else if (!locationRegex.test(row.location)) errors.push('location format is invalid');

  return errors.length
    ? { row: index + 1, errors }
    : null;
}

async function csvToUsers(fileBuffer) {
  // STEP 1 : scan file
  const cleanFile = await scanFile(fileBuffer);
  if (!cleanFile) {
    throw new Error('File rejected: virus scan failed');
  }

  // STEP 2 : parse file
  const csvString = fileBuffer.toString('utf-8');
  const rows = parseCsv(csvString);
  if (!rows.length) {
    throw new Error('File rejected: empty file')
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
      isActive: row.isActive === 'true' || row.isActive === true,
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
        errors: ['duplicate email in CSV'],
      });
      return;
    }

    emails.add(user.email);
    users.push(user);
  });

  // reject partial uploads
  if (errors.length) {
    const err = new Error('Data rejected: validation failed');
    err.details = errors;
    throw err;
  }

  return users;
}

module.exports = csvToUsers;
