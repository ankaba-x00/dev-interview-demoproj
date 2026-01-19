const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const connectDB = require('./service/db/index');
const authRoute = require('./service/routes/auth');
const userRoute = require('./service/routes/user');
const dataRoutes = require('./service/routes/data');

dotenv.config();

const app = express();

app.use(express.json({ limit: '200mb' }));
app.use(cors({
  origin: [
    'http://localhost:5001',
    'http://localhost:5173',
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'token',
    'x-frontend',
  ],
  credentials: false,
}));

connectDB();

app.use('/v1/auth', authRoute);
app.use('/v1/users', userRoute);
app.use('/v1/data', dataRoutes);

app.listen(3000, () => {
  console.log('Backend server is running');
});