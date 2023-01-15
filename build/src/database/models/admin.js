"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminModel = void 0;
const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
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
    // adminType : { type : Number , default : 0 , enum : [0,1,2]}, // 0 ---> admin , 1 -->artist , 2--> admin
    isActive: { type: Boolean, default: true },
    isBlock: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, defailt: false },
}, { timestamps: true });
exports.adminModel = mongoose.model('admin', adminSchema);
//# sourceMappingURL=admin.js.map