const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const csv = require('csv-parser');
const User = require('../entity/User');
const CSV_PATH = path.join(__dirname, '../../data/user.csv');

dotenv.config();

function parseBoolean(value) {
  return value === 'true' || value === true;
}

async function run() {
  await mongoose.connect(process.env.LOCAL_MONGO_URI);

  const users = [];

  fs.createReadStream(CSV_PATH)
    .pipe(csv())
    .on('data', row => {
      users.push({
        name: row.Name.trim(),
        email: row.Email.toLowerCase().trim(),
        location: row.Location.trim(),
        isActive: parseBoolean(row.Active),
        isBlocked: false,
        lastLogin: new Date(row.LastLogin),
        ipAddress: row.IPAddress,
      });
    })
    .on('end', async () => {
      try {
        await User.deleteMany({});
        await User.insertMany(users);
        console.log(`Inserted ${users.length} users`);
      } catch (err) {
        console.error(err);
      } finally {
        await mongoose.disconnect();
      }
    });
}

run();