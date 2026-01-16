const express = require("express")
const app = express()
const cors = require("cors");

app.use(express.json({ limit: "100mb" }))

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: '*',
  exposedHeaders: [
    'Location',
    'Content-Type',
    'Content-Description',
    'Content-Disposition',
    'Expires',
    'Cache-Control',
    'Pragma',
    'Content-Length',
    'Content-Range',
    'Max-Parts',
    'File-Part',
    'Temp-Name'
  ],
  credentials: true,
}))

const userRoute = require("./service/routes/user")
app.use("/v1/users", userRoute)

app.listen(3000, () => {
  console.log("Backend running on Port " + 3000);
});