const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String, // only present for local auth users
    },

    githubId: {
      type: String, // only present for OAuth users
    },

    displayName: {
      type: String,
    },
  },
  
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);