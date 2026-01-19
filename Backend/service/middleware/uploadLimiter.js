const multer = require('multer');

/**
 * Upload limits
 * 1. 5MB size limit
 * 2. 1 file/upload limit
 * 3. File type limit
 * 3.1. MIME check
 * 3.2. Extension check
*/

const uploadLimiter = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },

  fileFilter(req, file, cb) {
    const isCsvMime =
      file.mimetype === 'text/csv' ||
      file.mimetype === 'application/vnd.ms-excel';
    const isCsvExt = file.originalname.toLowerCase().endsWith('.csv');
    if (!isCsvMime || !isCsvExt) {
      return cb(new Error('Only CSV files are allowed'));
    }

    cb(null, true);
  },
});

module.exports = uploadLimiter;
