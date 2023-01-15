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
exports.admin_logout = exports.get_admin_profile = exports.admin_editProfile = void 0;
require('dotenv').config();
const common_1 = require("../../common");
const database_1 = require("../../database");
const helper_1 = require("../../helper");
const ObjectId = require('mongoose').Types.ObjectId;
const admin_editProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let body = req.body, { user } = req.headers;
    try {
        const response = yield database_1.adminModel.findOneAndUpdate({ _id: ObjectId(user._id), userType: 1, isActive: true }, body, { new: true });
        if (!response)
            return res.status(404).json(new common_1.apiResponse(400, helper_1.responseMessage.updateDataError("profile"), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage.updateDataSuccess("profile"), response, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.admin_editProfile = admin_editProfile;
const get_admin_profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let body = req.body, { user } = req.headers;
    try {
        const adminProfile = yield database_1.adminModel.findOne({ _id: ObjectId(user._id), isActive: true });
        if (!adminProfile)
            return res.status(404).json(new common_1.apiResponse(404, helper_1.responseMessage.getDataNotFound("admin"), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage.getDataSuccess("profile"), adminProfile, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.get_admin_profile = get_admin_profile;
const admin_logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let body = req.body, { user } = req.headers;
    try {
        const userData = yield database_1.adminModel.findOne({ _id: ObjectId(user._id), isActive: true, userType: 1 }, { isloggedIn: false });
        if (!userData)
            return res.status(404).json(new common_1.apiResponse(404, helper_1.responseMessage.getDataNotFound("admin"), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage.logout, {}, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.admin_logout = admin_logout;
//# sourceMappingURL=admin.js.map