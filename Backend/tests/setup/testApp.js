const express = require('express');
const healthRoutes = require('../../service/routes/healthz');
const authRoutes = require('../../service/routes/auth');
const userRoutes = require('../../service/routes/user');
const dataRoutes = require('../../service/routes/data');

const app = express();
app.use(express.json());

app.use('/', healthRoutes);
app.use('/v1/auth', authRoutes);
app.use('/v1/users', userRoutes);
app.use('/v1/data', dataRoutes);

module.exports = app;