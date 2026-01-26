const router = require('express').Router();
const User = require('../entity/User');
const verify = require('../middleware/validateToken');
const importLimiter = require('../middleware/importLimiter');
const uploadLimiter = require('../middleware/uploadLimiter');
const errorHandler = require('../middleware/errorHandler');
const { usersToCSV, csvToUsers } = require('../utils/csv/index');
// HELPER FUNCTIONS

function isAdmin(req) {
  return req.user?.role === 'ADMIN';
}

function sanitizeUser(user, admin) {
  if (admin) return user;
  const { lastLogin, ipAddress, ...publicUser } = user;
  return publicUser;
}

// ROUTES /v1/data

// GET USERS = EXPORT
router.get('/export', verify, async (req, res) => {
  try {
    const admin = isAdmin(req);

    const query = {};
    if (req.query.name) query.name = new RegExp(req.query.name, 'i');
    if (req.query.email) query.email = new RegExp(req.query.email, 'i');
    if (req.query.location) query.location = new RegExp(req.query.location, 'i');
    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }
    if (req.query.isBlocked !== undefined) {
      query.isBlocked = req.query.isBlocked === 'true';
    }
    if (admin && (req.query.loginRange || req.query.loginFrom || req.query.loginTo)) {
      query.lastLogin = {};
      const now = Date.now();
      const ranges = {
        '24h': 24 * 60 * 60 * 1000,
        '3d': 3 * 24 * 60 * 60 * 1000,
        '1w': 7 * 24 * 60 * 60 * 1000,
        '4w': 28 * 24 * 60 * 60 * 1000,
      };
      if (req.query.loginRange && ranges[req.query.loginRange]) {
        query.lastLogin.$gte = new Date(now - ranges[req.query.loginRange]);
      }
      if (req.query.loginFrom) {
        query.lastLogin.$gte = new Date(req.query.loginFrom);
      }
      if (req.query.loginTo) {
        query.lastLogin.$lte = new Date(
          new Date(req.query.loginTo).getTime() + 86400000
        );
      }
      if (Object.keys(query.lastLogin).length === 0) {
        delete query.lastLogin;
      }
    }

    const users = await User.find(query).lean();
    const csv = usersToCSV(
      users.map(u => sanitizeUser(u, admin)),
      admin
    );

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename='users-${Date.now()}.csv'`
    );
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to export users' });
  }
});

// POST USERS = IMPORT
router.post(
  '/import', 
  verify,
  (req, res, next) => {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: 'Admin only' });
    }
    next();
  },
  importLimiter,
  uploadLimiter.single('file'), 
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      const users = await csvToUsers(req.file.buffer);
      
      const emails = users.map(u => u.email);
      const existing = await User.find({
          email: { $in: emails },
        }).select('email');
      if (existing.length) {
        return res.status(409).json({
          message: 'Import failed: duplicate emails already exist',
          emails: existing.map(u => u.email),
        });
      }

      await User.insertMany(users, { ordered: true });
      res.status(201).json({
        message: 'Users imported successfully',
        count: users.length,
      });
    } catch (err) {
      console.error(err);

      if (err.details) {
        return res.status(400).json({
          message: 'File import failed',
          errors: err.details,
        });
      }

      res.status(500).json({ message: 'Failed to import users' });
    }
  },
  errorHandler
);

module.exports = router;