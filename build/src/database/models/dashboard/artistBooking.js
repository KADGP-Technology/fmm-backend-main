"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.artistBookingsModel = void 0;
const mongoose = require('mongoose');
const artistBookings = new mongoose.Schema({
    firstName: { type: String },
    data: { type: String },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: "artist" },
    customerBookings: [
        { userId: { type: mongoose.Types.ObjectId, ref: "user" },
            requireMent: { type: String },
            location: { type: String },
            date: { type: String } }
    ],
}, { timestamps: true });
exports.artistBookingsModel = mongoose.model('bookings', artistBookings);
//# sourceMappingURL=artistBooking.js.map