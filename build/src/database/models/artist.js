"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.artistModel = void 0;
const mongoose = require('mongoose');
const artistSchema = new mongoose.Schema({
    password: { type: String },
    //artist fields
    //1-->dashbord
    profilePhoto: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    gender: { type: Number, enum: [0, 1, 2] },
    phoneNumber: { type: String },
    email: { type: String },
    bio: { type: String },
    //2-->address
    lat: { type: Number },
    long: { type: Number },
    houseNumber: { type: String },
    area: { type: String },
    landMark: { type: String },
    country: { type: String },
    city: { type: String },
    state: { type: String },
    //3-->services
    //3(a)--->specialization
    specialisation: [{ type: String }],
    //3(b)-->services offerd
    bridalMakeup: { type: Boolean, default: true },
    partyMakeup: { type: Boolean, default: true },
    bodyFaceArt: { type: Boolean, default: true },
    cinematicMakeup: { type: Boolean, default: true },
    highFashionMakeup: { type: Boolean, default: true },
    //3(c) --> dropDown services
    bridalMakeupServiceArray: [{ type: String }],
    partyMakeupServiceArray: [{ type: String }],
    bodyFaceArtServiceArray: [{ type: String }],
    cinematicMakeupServiceArray: [{ type: String }],
    highFashionMakeupServiceArray: [{ type: String }],
    //later add
    //4-->presaging
    offerHairStyling: { type: Boolean, default: false },
    serviceStartAt: { type: Number },
    isCertified: { type: Boolean, default: false },
    certificate: { type: String },
    experience: { type: Number, enum: [0, 1, 2, 3] },
    travelToVenue: { type: Number, enum: [0, 1, 2] },
    usingBrands: [{ type: String }],
    haveStudio: { type: Boolean, default: false },
    dontShowBrands: { type: Boolean, default: false },
    //5-->portfolio
    albumName: { type: String },
    photoes: [{ type: String }],
    video: [{ type: String }],
    profileStatus: { type: Number, default: 0, enum: [0, 1, 2, 3, 4] },
    otp: { type: Number, default: null },
    otpExpireTime: { type: Date, default: null },
    isPhoneVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    // userType : { type : Number , default : 1 , enum : [0,1,2]}, // 0 ---> user , 1 -->artist , 2--> admin
    status: { type: Number, default: 0, enum: [0, 1, 2, 3] },
    isActive: { type: Boolean, default: true },
    isBlock: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, defailt: false },
    //dashBoard
    businessLeads: { type: mongoose.Types.ObjectId, ref: "businessLeads" },
    bookings: { type: mongoose.Types.ObjectId, ref: "bookings" }
}, { timestamps: true });
exports.artistModel = mongoose.model('artist', artistSchema);
//# sourceMappingURL=artist.js.map