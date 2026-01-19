const {
  emailRegex,
  nameRegex,
  locationRegex
} = require("../../validation/regexPatterns")

function validateRow(row, index) {
  const errors = [];

  if (!row.name) errors.push("name is required")
  else if (!nameRegex.test(row.name)) errors.push("name format is invalid");

  if (!row.email) errors.push("email is required")
  else if (!emailRegex.test(row.email)) errors.push("email format is invalid");

  if (!row.location) errors.push("location is required")
  else if (!locationRegex.test(row.location)) errors.push("location format is invalid");

  return errors.length
    ? { row: index + 1, errors }
    : null;
}

module.exports = validateRow;