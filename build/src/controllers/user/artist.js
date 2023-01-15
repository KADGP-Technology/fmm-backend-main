"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_favourite_artists = exports.mark_artist_favourite = exports.get_artist_pagination = void 0;
require('dotenv').config();
const database_1 = require("../../database");
const common_1 = require("../../common");
const helper_1 = require("../../helper");
const favouritArtist_1 = require("../../database/models/favouritArtist");
const ObjectId = require('mongoose').Types.ObjectId;
const get_artist_pagination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    (0, helper_1.reqInfo)(req);
    let { user } = req.headers, { page, limit, search, partyMakeup, bridalMakeup, bodyFaceArt, cinematicMakeup, highFashionMakeup, priceRange, experience, certifiedOnly, verifiedOnly, travelToVenue, offerHairStyling, offerInStudioService, } = req.body, match = {};
    try {
        // if (search) {
        //     var nameArray: Array<any> = []
        //     search = search.split(" ")
        //     search.forEach(data => {
        //         nameArray.push({ name: { $regex: data, $options: 'si' } })
        //     })
        //     match.$or = [{ $and: nameArray }]
        // }
        if (partyMakeup)
            match.partyMakeup = true;
        if (bridalMakeup)
            match.bridalMakeup = true;
        if (bodyFaceArt)
            match.bodyFaceArt = true;
        if (cinematicMakeup)
            match.cinematicMakeup = true;
        if (highFashionMakeup)
            match.highFashionMakeup = true;
        if (priceRange.min != "")
            match.serviceStartAt = { $gte: priceRange.min, $lt: priceRange.max };
        if ((experience === null || experience === void 0 ? void 0 : experience.length) > 0)
            match.experience = { $in: experience };
        if (certifiedOnly)
            match.isCertified = true;
        if (verifiedOnly)
            match.status = 1;
        if (offerHairStyling)
            match.offerHairStyling = true;
        if (travelToVenue == 0 || travelToVenue)
            match.travelToVenue = travelToVenue;
        if (offerInStudioService)
            match.haveStudio = true;
        // match.status = 1; to get only verfied artists
        match.isBlock = false;
        console.log(match);
        const artist = yield database_1.artistModel.aggregate([
            { $match: match },
            {
                $facet: {
                    data: [
                        { $sort: { createdAt: -1 } },
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                    ],
                    data_count: [{ $count: "count" }]
                }
            },
        ]);
        if (artist[0].data.length == 0)
            return res.status(404).json(new common_1.apiResponse(404, helper_1.responseMessage.getDataNotFound("artist"), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage.getDataSuccess("artist"), {
            artistData: artist[0].data,
            state: {
                page: page,
                limit: limit,
                page_limit: Math.ceil(((_a = artist[0].data_count[0]) === null || _a === void 0 ? void 0 : _a.count) / ((_b = req.body) === null || _b === void 0 ? void 0 : _b.limit)) || 1,
            }
        }, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.get_artist_pagination = get_artist_pagination;
const mark_artist_favourite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { user } = req.headers, body = req.body, { createdFor, isFavourite } = req.body;
    try {
        let updatedDoc = yield favouritArtist_1.favouriteArtistModel.findOneAndUpdate({ createdFor: ObjectId(createdFor), createdBy: ObjectId(user._id) }, { isFavourite: isFavourite }, { new: true });
        if (!updatedDoc) {
            body.createdBy = ObjectId(user._id);
            console.log(body);
            let newDoc = yield new favouritArtist_1.favouriteArtistModel(body).save();
            if (!newDoc)
                return res.status(404).json(new common_1.apiResponse(404, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.addDataError, {}, {}));
            return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.addDataSuccess("favourite Artist"), newDoc, {}));
        }
        if (!updatedDoc)
            return res.status(404).json(new common_1.apiResponse(404, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.updateDataError("favourite artist"), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.updateDataSuccess("favourite Artist"), updatedDoc, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.mark_artist_favourite = mark_artist_favourite;
const get_favourite_artists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { user } = req.headers, body = req.body;
    try {
        const fav_artists = yield favouritArtist_1.favouriteArtistModel.find({ createdBy: ObjectId(user._id), isFavourite: true }).populate("createdBy createdBy");
        if (fav_artists.length == 0)
            return res.status(404).json(new common_1.apiResponse(404, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.getDataNotFound("favourite artist"), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.getDataSuccess("favourite Artist"), fav_artists, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.get_favourite_artists = get_favourite_artists;
//# sourceMappingURL=artist.js.map