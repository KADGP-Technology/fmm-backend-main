"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.favouriteArtistModel = void 0;
const mongoose = require('mongoose');
const favouriteArtistSchema = new mongoose.Schema({
    createdFor: { type: mongoose.Schema.Types.ObjectId, ref: "artist" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    isFavourite: { type: Boolean, default: true }
}, { timestamps: true });
exports.favouriteArtistModel = mongoose.model('favouriteArtist', favouriteArtistSchema);
//# sourceMappingURL=favouritArtist.js.map