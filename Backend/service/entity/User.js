const mongoose = require("mongoose");
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String,
      trim: true,
      match: [/^[A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)+$/, "Name may only contain letters and spaces and must contain 2 or more words"],
      required: [true, "Name is required"],
    },
    email: { 
      type: String,
      lowercase: true,
      trim: true,
      match: [/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "Email may contain letters, numbers, dot, underscore, percent, plus and hyphen before @ and requires a TLD of 2 or more letters"],
      required: [true, "Email is required"],
      unique: true
    },
    location: {
      type: String,
      trim: true,
      match: [/^[A-Za-zäüöÄÜÖ\-]+$/, "Location may only contain letters, German Umlaute and hyphens with no spaces"],
      required: [true, "Location is required"],
    },
    isActive: { 
      type: Boolean, 
      default: true,
      required: [true, "Active status is required"]
    },
    isBlocked: { 
      type: Boolean, 
      default: false,
      required: [true, "Blocked status is required"]
    },
    lastLogin: {
      type: Date,
      default: null,
      required: false
    },
    ipAdress: { 
      type: String, 
      trim: true,
      validate: {
        validator: validator.isIP,
        message: props => `${props.value} is not a valid IP address!`
      }
    },
  },
  { timestamps: true }
);

module.exports = userSchema; 
