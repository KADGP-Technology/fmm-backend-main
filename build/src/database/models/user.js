"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    password: { type: String },
    phoneNumber: { type: String },
    profilePhoto: { type: String },
    otp: { type: Number, default: null },
    otpExpireTime: { type: Date, default: null },
    isPhoneVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    userType: { type: Number, default: 0, enum: [0, 1, 2] },
    isActive: { type: Boolean, default: true },
    isBlock: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, defailt: false },
}, { timestamps: true });
exports.userModel = mongoose.model('user', userSchema);
//# sourceMappingURL=user.js.map