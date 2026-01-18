const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const connectDB = require("./service/utils/db.js");
const authRoute = require("./service/routes/auth");
const userRoute = require("./service/routes/user");

dotenv.config();

const app = express();

app.use(express.json({ limit: "200mb" }));
app.use(cors({
  origin: 'https://localhost:5001',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'Athorization',
  ],
}));

connectDB();

app.use("/v1/auth", authRoute);
app.use("/v1/users", userRoute);

app.listen(3000, () => {
  console.log("Backend server is running");
});