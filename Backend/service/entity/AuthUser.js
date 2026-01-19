const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    email: { 
      type: String,
      lowercase: true,
      trim: true,
      required: [true, 'Email is required'],
      unique: true,
      validate: [validator.isEmail, 'Invalid email address'],
    },
    password: { 
      type: String, 
      required: [true, 'Password is required'],
    }, 
    role: {
      type: String, 
      enum: ['USER', 'ADMIN'], 
      default: 'USER',
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

module.exports = mongoose.model('AuthUser', userSchema);
