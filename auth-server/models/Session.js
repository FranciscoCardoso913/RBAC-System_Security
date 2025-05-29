const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  privateKeyPem: String,
  publicKeyPem: String,
  role: String,
  createdAt: { type: Date, default: Date.now, expires: 3600 } // expire in 1 hour
});

module.exports = mongoose.model('Session', sessionSchema);
