const router = require('express').Router();
const mongoose = require("mongoose");
const User = require("../entity/User");
const { validateCreateUser, validateUpdateUser } = require("../validation/userValidation");
const verify = require("../utils/validateToken");

// HELPER FUNCTIONS

function isAdmin(req) {
  return req.user?.role === "ADMIN";
}

function sanitizeUser(user, admin) {
  if (admin) return user;
  const { lastLogin, ipAddress, ...safeUser } = user;
  return safeUser;
}

// ROUTES /v1/users

// GET USERS
router.get("/", verify, async (req, res) => {
  try {
    const admin = isAdmin(req);

    const {
      name,
      email,
      location,
      isActive,
      isBlocked,
      loginRange,
      loginFrom,
      loginTo,
      sortBy = "name",
      order = "asc",
      page = 1,
      limit = 25
    } = req.query;

    const query = {};

    if (name) query.name = new RegExp(name, "i");
    if (email) query.email = new RegExp(email, "i");
    if (location) query.location = new RegExp(location, "i");

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    if (isBlocked !== undefined) {
      query.isBlocked = isBlocked === "true";
    }

    if (admin && (loginRange || loginFrom || loginTo)) {
      query.lastLogin = {};

      if (loginRange) {
        const now = Date.now();
        const ranges = {
          "24h": 24 * 60 * 60 * 1000,
          "3d": 3 * 24 * 60 * 60 * 1000,
          "1w": 7 * 24 * 60 * 60 * 1000,
          "4w": 28 * 24 * 60 * 60 * 1000,
        };

        if (ranges[loginRange]) {
          query.lastLogin.$gte = new Date(now - ranges[loginRange]);
        }
      }

      if (loginFrom) {
        query.lastLogin.$gte = new Date(loginFrom);
      }

      if (loginTo) {
        query.lastLogin.$lte = new Date(
          new Date(loginTo).getTime() + 86400000
        );
      }

      if (Object.keys(query.lastLogin).length === 0) {
        delete query.lastLogin;
      }
    }

    const sort = { [sortBy]: order === "asc" ? 1 : -1 };
    const pageNumber = Math.max(parseInt(page, 10), 1);
    const pageSize = Math.max(parseInt(limit, 10), 1);
    const skip = (pageNumber - 1) * pageSize;

    const [users, total] = await Promise.all([
      User.find(query)
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .lean(),
      User.countDocuments(query)
    ]);

    const sanitizedUsers = users.map(u => sanitizeUser(u, admin));

    res.json({
      data: sanitizedUsers,
      meta: {
        page: pageNumber,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// GET USER
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(req.params.id).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(sanitizeUser(user, isAdmin(req)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// POST USER
router.post('', verify, async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Admin access required" });
  }

  const { error } = validateCreateUser(req.body);
  if (error) {
    return res.status(400).json(error.details);
  }

  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to create user" });
  }
});

// UPDATE USER
router.patch('/:id', verify, async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Admin access required" });
  }

  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json(error.details);
  }

  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user" });
  }
});

// DELETE USER
router.delete('/:id', verify, async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Admin access required" });
  }

  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// BLOCK USER
router.patch('/:id/block', verify, async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Admin access required" });
  }

  try {
    await User.findByIdAndUpdate(req.params.id, { isBlocked: true });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to block user" });
  }
});

// UNBLOCK USER
router.patch('/:id/unblock', verify, async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Admin access required" });
  }

  try {
    await User.findByIdAndUpdate(req.params.id, { isBlocked: false });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to unblock user" });
  }
});

module.exports = router;