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
exports.update_bookings = exports.get_bookings = exports.create_bookings = void 0;
const artistBooking_1 = require("./../../database/models/dashboard/artistBooking");
"use strict";
require('dotenv').config();
const common_1 = require("../../common");
const helper_1 = require("../../helper");
const ObjectId = require('mongoose').Types.ObjectId;
//---------------------------- Dashboard -------------------------------------------//
const create_bookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("REQUESTT", req.body);
    try {
        // const getArtist = await artistBusinessLeadsModel.findById({_id:req.body._id})
        const createBooking = new artistBooking_1.artistBookingsModel(req.body).save();
        if (createBooking) {
            return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.customMessage("Bookings Created"), createBooking, {}));
        }
    }
    catch (error) {
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.create_bookings = create_bookings;
const get_bookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { artistId } = req.body;
    try {
        // const getArtist = await artistBusinessLeadsModel.findById({_id:req.body._id})
        const getBookings = yield artistBooking_1.artistBookingsModel.findOne({ artist: artistId }).populate({
            path: 'customerBookings',
            populate: 'userId'
        }).select('firstName');
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.customMessage("Bookings fetched"), getBookings, {}));
    }
    catch (error) {
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.get_bookings = get_bookings;
const update_bookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("REQUESTT business update", req.body);
    var currentdate = new Date();
    const { artistId, userId, requireMent, location, } = req.body;
    console.log(ObjectId(artistId));
    try {
        const updateBookings = yield artistBooking_1.artistBookingsModel.findOneAndUpdate({ artist: artistId }, {
            $push: {
                customerBookings: { userId, requireMent, location, date: (currentdate.getDate() + "/"
                        + (currentdate.getMonth() + 1) + "/"
                        + currentdate.getFullYear()) }
            },
            requireMent,
            location
        });
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.customMessage("Bookings updated"), updateBookings, {}));
    }
    catch (error) {
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.update_bookings = update_bookings;
//# sourceMappingURL=bookings.js.map