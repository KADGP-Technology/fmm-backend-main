"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.artistBusinessLeadsModel = void 0;
const mongoose = require('mongoose');
const artistBusinessLeadsSchema = new mongoose.Schema({
    firstName: { type: String },
    data: { type: String },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: "artist" },
    // businessLeadsCustomer:[{type:mongoose.Types.ObjectId,ref:"user",requireMent:{type:String},location:{type:String}}],
    // businessLeadsCustomer:[{requireMent:{type:String},location:{type:String}}],
    businessLeadsCustomer: [
        { userId: { type: mongoose.Types.ObjectId, ref: "user" },
            requireMent: { type: String },
            location: { type: String },
            date: { type: String } }
    ],
}, { timestamps: true });
exports.artistBusinessLeadsModel = mongoose.model('businessLeads', artistBusinessLeadsSchema);
//# sourceMappingURL=artistBusinessLeads.js.map