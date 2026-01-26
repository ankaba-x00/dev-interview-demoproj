const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String,
      trim: true,
      required: [true, 'Name is required'],
    },
    email: { 
      type: String,
      lowercase: true,
      trim: true,
      required: [true, 'Email is required'],
      unique: true,
      validate: [validator.isEmail, 'Invalid email address'],
    },
    location: {
      type: String,
      trim: true,
      required: [true, 'Location is required'],
    },
    isActive: { 
      type: Boolean, 
      default: true,
    },
    isBlocked: { 
      type: Boolean, 
      default: false,
    },
    lastLogin: {
      type: Date, 
      index: true,
    },
    ipAddress: { 
      type: String, 
      validate: {
        validator: validator.isIP,
        message: props => `${props.value} is not a valid IP address`,
      },
    },
  },
  { timestamps: true },
);

module.exports = 
  mongoose.models.User ||
  mongoose.model('User', userSchema);
