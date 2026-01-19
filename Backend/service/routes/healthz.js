const router = require('express').Router();
const mongoose = require('mongoose');

router.get('/healthz', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();

    res.status(200).json({
      status: 'ok',
      db: 'connected',
      uptime: process.uptime(),
      timestamp: Date.now(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'degraded',
      db: 'disconnected',
      timestamp: Date.now(),
    });
  }
});

module.exports = router;