const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: { type: String, default: null},
    last_name: { type: String, default: null},
    email: { type: String, unique: true },
    password: { type: String },
    token: { type: String },
    liMoney: {type: Number, default: 500}
});

module.exports = mongoose.model("userJWT", userSchema);