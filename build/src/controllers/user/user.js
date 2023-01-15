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
exports.update_user_profile = exports.get_user_profile = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("../../common");
const database_1 = require("../../database");
const helper_1 = require("../../helper");
const ObjectId = mongoose_1.default.Types.ObjectId;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const get_user_profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { user } = req.headers, body = req.body;
    try {
        const response = yield database_1.userModel.findOne({ _id: ObjectId(user._id), isActive: true });
        if (response.length == 0)
            return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage.getDataNotFound("user"), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage.getDataSuccess("user"), response, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.get_user_profile = get_user_profile;
const update_user_profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { user } = req.headers, body = req.body;
    try {
        const salt = yield bcryptjs_1.default.genSaltSync(10);
        const hashPassword = yield bcryptjs_1.default.hash(body.password, salt);
        delete body.password;
        body.password = hashPassword;
        const response = yield database_1.userModel.findOneAndUpdate({ _id: ObjectId(user._id), isActive: true }, body, { new: true });
        if (response.length == 0)
            return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage.updateDataError("user"), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage.updateDataSuccess("user"), response, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.update_user_profile = update_user_profile;
//# sourceMappingURL=user.js.map