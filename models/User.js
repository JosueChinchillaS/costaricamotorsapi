const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  planId: { type: String, default: 1 },
  creditBalance: { type: Number, default: 10 },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
