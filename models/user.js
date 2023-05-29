const { Schema, model } = require("mongoose");

const mongoose = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      match: /^\w+((\.|-|_)?\w+)*@\w+((\.|-|_)?\w+)*(\.\w{2,3})+$/,
      required: true,
    },
    password: { type: String, minglength: 6, required: 6 },

    // owner: { type: String.Tupes.ObjectId, ref: "user," },
  },
  { versionKey: false, timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;
