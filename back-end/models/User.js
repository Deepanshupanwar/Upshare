const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: { type: String, default: ""},
  profile_pic: { type: String, default: ""},
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: {type: String, default: ""},
  folder: {type: Array, default: [], ref:'Folder'},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
