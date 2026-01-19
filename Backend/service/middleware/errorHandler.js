const multer = require("multer");

function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: "Upload limits exceeded: max 5MB, accepted type: csv, 1 file per upload",
      code: err.code,
      error: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      message: err.message || "Invalid file upload",
    });
  }

  next();
}

module.exports = errorHandler;
