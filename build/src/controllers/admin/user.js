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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.block_user = exports.get_user_by_id = exports.get_user_pagination = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("../../common");
const database_1 = require("../../database");
const helper_1 = require("../../helper");
const ObjectId = mongoose_1.default.Types.ObjectId;
const get_user_pagination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    (0, helper_1.reqInfo)(req);
    let response, { page, limit, search } = req.body, match = {};
    try {
        if (search) {
            var nameArray = [];
            var phoneArray = [];
            search = search.split(" ");
            search.forEach(data => {
                nameArray.push({ firstName: { $regex: data, $options: 'si' } });
                phoneArray.push({ phoneNumber: { $regex: data, $options: 'si' } });
            });
            match.$or = [{ $and: nameArray }, { $and: phoneArray }];
        }
        match.isActive = true;
        match.isPhoneVerified = true;
        response = yield database_1.userModel.aggregate([
            { $match: match },
            {
                $facet: {
                    data: [
                        { $sort: { createdAt: -1 } },
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                        // { $project: { firstName: 1, lastName: 1, profile_image: 1, email: 1, phoneNumber: 1, isuser: 1, isActive: 1, isBlock: 1, loginType: 1, createdAt: 1 } },
                    ],
                    data_count: [{ $count: "count" }]
                }
            },
        ]);
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.getDataSuccess('user'), {
            user_data: response[0].data,
            state: {
                page: page,
                limit: limit,
                page_limit: Math.ceil(((_a = response[0].data_count[0]) === null || _a === void 0 ? void 0 : _a.count) / ((_b = req.body) === null || _b === void 0 ? void 0 : _b.limit)) || 1,
            }
        }, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.get_user_pagination = get_user_pagination;
const get_user_by_id = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { user } = req.headers, body = req.body;
    let { id } = req.params;
    try {
        const response = yield database_1.userModel.findOne({ _id: ObjectId(id), isActive: true });
        if (response.length == 0)
            return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage.getDataNotFound("user"), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage.getDataSuccess("user"), response, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.get_user_by_id = get_user_by_id;
const block_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { user } = req.headers, { flag, id } = req.body;
    try {
        const user = yield database_1.userModel.findOneAndUpdate({ _id: ObjectId(id), isActive: true }, { isBlock: flag }, { new: true });
        if (!user)
            return res.status(404).json(new common_1.apiResponse(404, helper_1.responseMessage.getDataNotFound("user"), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage.updateDataSuccess("user"), user, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.block_user = block_user;
//# sourceMappingURL=user.js.map