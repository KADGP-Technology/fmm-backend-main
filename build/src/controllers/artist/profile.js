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
exports.get_by_id_profile = exports.updateProfile = void 0;
require('dotenv').config();
const database_1 = require("../../database");
const common_1 = require("../../common");
const helper_1 = require("../../helper");
const ObjectId = require('mongoose').Types.ObjectId;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let body = req.body, { user } = req.headers;
    console.log(user);
    try {
        const profile = yield database_1.artistModel.findOneAndUpdate({ isActive: true, _id: ObjectId(user === null || user === void 0 ? void 0 : user._id) }, body, { new: true });
        if (!profile)
            return res.status(404).json(new common_1.apiResponse(404, helper_1.responseMessage.updateDataError("artist profile"), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.updateDataSuccess("artist profile"), profile, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.updateProfile = updateProfile;
const get_by_id_profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { user } = req.headers, body = req.body;
    try {
        const response = yield database_1.artistModel.findOne({ isActive: true, _id: ObjectId(user._id) });
        if (response.length == 0)
            return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage.getDataNotFound("user profile"), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage.getDataSuccess("profiles"), response, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.get_by_id_profile = get_by_id_profile;
//# sourceMappingURL=profile.js.map