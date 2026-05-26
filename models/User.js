const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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

  { timestamps: true },
);

// Pre-save hook — hashes password before saving
userSchema.pre("save", async function () {
  if (this.password && (this.isNew || this.isModified("password"))) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
