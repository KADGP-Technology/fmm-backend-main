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
exports.update_business_leads = exports.get_business_leads = exports.create_business_leads = void 0;
const artistBusinessLeads_1 = require("./../../database/models/dashboard/artistBusinessLeads");
"use strict";
require('dotenv').config();
const common_1 = require("../../common");
const helper_1 = require("../../helper");
const ObjectId = require('mongoose').Types.ObjectId;
//---------------------------- Dashboard -------------------------------------------//
const create_business_leads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("REQUESTT", req.body);
    try {
        // const getArtist = await artistBusinessLeadsModel.findById({_id:req.body._id})
        const getBusinessLeads = new artistBusinessLeads_1.artistBusinessLeadsModel(req.body).save();
        if (getBusinessLeads) {
            return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.customMessage("Business Leds Created"), getBusinessLeads, {}));
        }
    }
    catch (error) {
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.create_business_leads = create_business_leads;
const get_business_leads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { artistId } = req.body;
    try {
        // const getArtist = await artistBusinessLeadsModel.findById({_id:req.body._id})
        const getBusinessLeads = yield artistBusinessLeads_1.artistBusinessLeadsModel.findOne({ artist: artistId }).populate({
            path: 'businessLeadsCustomer',
            populate: 'userId'
        }).select('firstName');
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.customMessage("Business Leds fetched"), getBusinessLeads, {}));
    }
    catch (error) {
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.get_business_leads = get_business_leads;
const update_business_leads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("REQUESTT business update", req.body);
    var currentdate = new Date();
    const { artistId, userId, requireMent, location, } = req.body;
    console.log(ObjectId(artistId));
    try {
        const getBusinessLeads = yield artistBusinessLeads_1.artistBusinessLeadsModel.findOneAndUpdate({ artist: artistId }, {
            $push: { businessLeadsCustomer: { userId, requireMent, location, date: (currentdate.getDate() + "/"
                        + (currentdate.getMonth() + 1) + "/"
                        + currentdate.getFullYear()) } },
            requireMent,
            location
        });
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.customMessage("Business Leds updated"), getBusinessLeads, {}));
    }
    catch (error) {
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.update_business_leads = update_business_leads;
//# sourceMappingURL=businessLeads.js.map