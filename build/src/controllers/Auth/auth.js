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
exports.admin_otp_verification = exports.adminLogin = exports.adminSignUp = exports.google_SL = exports.login = exports.signUp = exports.resend_otp = exports.otp_verification = exports.mobile_verify = void 0;
require('dotenv').config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../../database");
const common_1 = require("../../common");
const helper_1 = require("../../helper");
const axios_1 = __importDefault(require("axios"));
const ObjectId = require('mongoose').Types.ObjectId;
const jwt_token_secret = process.env.JWT_TOKEN_SECRET;
const specify_model_asper_role = (userType) => {
    if (userType == 0)
        return database_1.userModel;
    if (userType == 1)
        return database_1.artistModel;
    // if (userType == 2) return adminModel;
    return null;
};
const mobile_verify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    console.log(req.body);
    let body = req.body, otp, otpFlag = 1, // OTP has already assign or not for cross-verification
    authToken = 0;
    let model = specify_model_asper_role(body.userType);
    if (!model)
        return res.status(404).json(new common_1.apiResponse(404, "please provide appropriate userType", {}, {}));
    try {
        const isAlready = yield model.findOne({ phoneNumber: body === null || body === void 0 ? void 0 : body.phoneNumber, isActive: true });
        if ((isAlready === null || isAlready === void 0 ? void 0 : isAlready.isPhoneVerified) == false) {
            const data2 = yield model.findOneAndDelete({ phoneNumber: body === null || body === void 0 ? void 0 : body.phoneNumber, isActive: true });
            console.log(data2);
        }
        if ((isAlready === null || isAlready === void 0 ? void 0 : isAlready.isPhoneVerified) == true) {
            while (otpFlag == 1) {
                for (let flag = 0; flag < 1;) {
                    otp = yield Math.round(Math.random() * 1000000);
                    if (otp.toString().length == 6) {
                        flag++;
                    }
                }
                let isAlreadyAssign = yield model.findOne({ otp: otp });
                if ((isAlreadyAssign === null || isAlreadyAssign === void 0 ? void 0 : isAlreadyAssign.otp) != otp)
                    otpFlag = 0;
            }
            //here send otp via sns ....
            let result = yield (0, helper_1.sendSMS)("91", isAlready === null || isAlready === void 0 ? void 0 : isAlready.phoneNumber, `${common_1.SMS_message.OTP_verification} ${otp}`);
            if (result) {
                // console.log(result);
                yield model.findOneAndUpdate(body, { otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) });
                return res.status(200).json(new common_1.apiResponse(200, `OTP sened succesfully to ${isAlready === null || isAlready === void 0 ? void 0 : isAlready.phoneNumber}`, {}, {}));
            }
            else
                return res.status(501).json(new common_1.apiResponse(501, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.errorMail, {}, `${result}`));
        }
        if ((isAlready === null || isAlready === void 0 ? void 0 : isAlready.isPhoneVerified) == true && (isAlready === null || isAlready === void 0 ? void 0 : isAlready.profileStatus) == 4)
            return res.status(409).json(new common_1.apiResponse(409, "phone number exist already", {}, {}));
        if ((isAlready === null || isAlready === void 0 ? void 0 : isAlready.isBlock) == true)
            return res.status(403).json(new common_1.apiResponse(403, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.accountBlock, {}, {}));
        let response = yield new model(body).save();
        // response = {
        //     userType: response?.userType,
        //     isEmailVerified: response?.isEmailVerified,
        //     isPhoneVerified : response?.isPhoneVerified,
        //     _id: response?._id,
        //     phoneNumber: response?.phoneNumber,
        // }
        while (otpFlag == 1) {
            for (let flag = 0; flag < 1;) {
                otp = yield Math.round(Math.random() * 1000000);
                if (otp.toString().length == 6) {
                    flag++;
                }
            }
            let isAlreadyAssign = yield model.findOne({ otp: otp });
            if ((isAlreadyAssign === null || isAlreadyAssign === void 0 ? void 0 : isAlreadyAssign.otp) != otp)
                otpFlag = 0;
        }
        //here send otp via sns ....
        let result = yield (0, helper_1.sendSMS)("91", response === null || response === void 0 ? void 0 : response.phoneNumber, `${common_1.SMS_message.OTP_verification} ${otp}`);
        if (result) {
            // console.log(result);
            yield model.findOneAndUpdate(body, { otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) });
            return res.status(200).json(new common_1.apiResponse(200, `OTP sened succesfully to ${response === null || response === void 0 ? void 0 : response.phoneNumber}`, {}, {}));
        }
        else
            return res.status(501).json(new common_1.apiResponse(501, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.errorMail, {}, `${result}`));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.mobile_verify = mobile_verify;
const otp_verification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let body = req.body;
    let model = specify_model_asper_role(body.userType);
    if (!model)
        return res.status(404).json(new common_1.apiResponse(404, "please provide appropriate userType", {}, {}));
    try {
        body.isActive = true;
        let data = yield model.findOne(body);
        if (!data)
            return res.status(400).json(new common_1.apiResponse(400, "Invalid otp or User does not exist!", {}, {}));
        if (data.isBlock == true)
            return res.status(403).json(new common_1.apiResponse(403, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.accountBlock, {}, {}));
        if (new Date(data.otpExpireTime).getTime() < new Date().getTime())
            return res.status(410).json(new common_1.apiResponse(410, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.expireOTP, {}, {}));
        let userData = yield model.findOneAndUpdate(body, { otp: null, otpExpireTime: null, isPhoneVerified: true, isLoggedIn: true }, { new: true });
        const token = jsonwebtoken_1.default.sign({
            _id: userData._id,
            type: userData.userType,
            status: "Login",
            generatedOn: (new Date().getTime())
        }, jwt_token_secret);
        yield new database_1.userSessionModel({
            createdBy: userData._id,
        }).save();
        let result = {
            data: userData,
            token,
        };
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.OTPverified, result, {}));
    }
    catch (error) {
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.otp_verification = otp_verification;
const resend_otp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let body = req.body, otp, otpFlag = 1, // OTP has already assign or not for cross-verification
    authToken = 0;
    let model = specify_model_asper_role(body.userType);
    if (!model)
        return res.status(404).json(new common_1.apiResponse(404, "please provide appropriate userType", {}, {}));
    try {
        //resetting otp
        while (otpFlag == 1) {
            for (let flag = 0; flag < 1;) {
                otp = yield Math.round(Math.random() * 1000000);
                if (otp.toString().length == 6) {
                    flag++;
                }
            }
            let isAlreadyAssign = yield model.findOne({ otp: otp });
            if ((isAlreadyAssign === null || isAlreadyAssign === void 0 ? void 0 : isAlreadyAssign.otp) != otp)
                otpFlag = 0;
        }
        const response = yield model.findOneAndUpdate({ phoneNumber: body === null || body === void 0 ? void 0 : body.phoneNumber, isActive: true }, { otp: otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)), isOTPVerified: false });
        if (!response) {
            return res.status(404).json(new common_1.apiResponse(404, "invalid mobile!", null, {}));
        }
        //user saved succesfully now send otp to the user
        let result = yield (0, helper_1.sendSMS)("91", response === null || response === void 0 ? void 0 : response.phoneNumber, `${common_1.SMS_message.OTP_verification} ${otp}`);
        if (!result) {
            //tap on resend otp
            yield model.findOneAndUpdate({ email: response.email }, { otp: null, otpExpierTime: null });
            return res.status(501).json(new common_1.apiResponse(501, "error in sending otp from server tap on resend otp", {}, {}));
        }
        //otp sended
        return res.status(200).json(new common_1.apiResponse(200, `OTP sened succesfully to ${response === null || response === void 0 ? void 0 : response.phoneNumber}`, {}, {}));
    }
    catch (error) {
        console.log("error", error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, null, error));
    }
});
exports.resend_otp = resend_otp;
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    console.log(req.body);
    let body = req.body;
    let model = specify_model_asper_role(body.userType);
    if (!model)
        return res.status(404).json(new common_1.apiResponse(404, "please provide appropriate userType", {}, {}));
    try {
        const salt = yield bcryptjs_1.default.genSaltSync(10);
        const hashPassword = yield bcryptjs_1.default.hash(body.password, salt);
        delete body.password;
        body.password = hashPassword;
        let userData = yield model.findOneAndUpdate({ isActive: true, phoneNumber: body.phoneNumber, isPhoneVerified: true }, body, { new: true });
        if (!userData)
            return res.status(404).json(new common_1.apiResponse(404, "Bad Signup!", {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.signupSuccess, userData, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.signUp = signUp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let body = req.body, otp, otpFlag = 1, // OTP has already assign or not for cross-verification
    authToken = 0, response;
    let model = specify_model_asper_role(body.userType);
    if (!model)
        return res.status(404).json(new common_1.apiResponse(404, "please provide appropriate userType", {}, {}));
    try {
        // if(body.userType == 1) 
        response = yield model.findOne({ phoneNumber: body === null || body === void 0 ? void 0 : body.phoneNumber, isActive: true, isPhoneVerified: true });
        if (!response)
            return res.status(404).json(new common_1.apiResponse(404, "Mobile Number Is Not Registerd!", {}, {}));
        if (body.userType == 1) {
            let check2 = yield model.findOne({ phoneNumber: body === null || body === void 0 ? void 0 : body.phoneNumber, isActive: true, isPhoneVerified: true, profileStatus: 4 });
            if (!check2)
                return res.status(405).json(new common_1.apiResponse(405, "Please Complete Signup First!", response, {}));
        }
        if ((response === null || response === void 0 ? void 0 : response.isBlock) == true)
            return res.status(403).json(new common_1.apiResponse(403, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.accountBlock, {}, {}));
        while (otpFlag == 1) {
            for (let flag = 0; flag < 1;) {
                otp = yield Math.round(Math.random() * 1000000);
                if (otp.toString().length == 6) {
                    flag++;
                }
            }
            let isAlreadyAssign = yield model.findOne({ otp: otp });
            if ((isAlreadyAssign === null || isAlreadyAssign === void 0 ? void 0 : isAlreadyAssign.otp) != otp)
                otpFlag = 0;
        }
        //here send otp via sns ....
        let result = yield (0, helper_1.sendSMS)("91", response === null || response === void 0 ? void 0 : response.phoneNumber, `${common_1.SMS_message.OTP_verification} ${otp}`);
        if (result) {
            yield model.findOneAndUpdate({ phoneNumber: body === null || body === void 0 ? void 0 : body.phoneNumber }, { otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) });
            return res.status(200).json(new common_1.apiResponse(200, `OTP sened succesfully to ${response === null || response === void 0 ? void 0 : response.phoneNumber}`, {}, {}));
        }
        else
            return res.status(501).json(new common_1.apiResponse(501, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.errorMail, {}, `${result}`));
    }
    catch (error) {
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.login = login;
const google_SL = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let body = req.body;
    let { accessToken, idToken } = req.body;
    let model = specify_model_asper_role(body.userType);
    if (!model)
        return res.status(404).json(new common_1.apiResponse(404, "please provide appropriate userType", {}, {}));
    try {
        if (accessToken && idToken) {
            let verificationAPI = `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`, idAPI = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
            let access_token = yield axios_1.default.get(verificationAPI)
                .then((result) => {
                return result.data;
            }).catch((error) => {
                return false;
            });
            let id_token = yield axios_1.default.get(idAPI)
                .then((result) => {
                return result.data;
            }).catch((error) => {
                return false;
            });
            if (access_token.email == id_token.email && access_token.verified_email == true) {
                const isUser = yield model.findOne({ email: id_token === null || id_token === void 0 ? void 0 : id_token.email, isActive: true });
                if (!isUser) {
                    //new user
                    let response = {
                        email: id_token.email,
                        firstName: id_token.given_name,
                        lastName: id_token.family_name,
                        image: id_token.picture,
                        isEmailVerified: true,
                        // _id: isUser?._id,
                        logintype: "google"
                    };
                    const newUser = yield model(response).save();
                    const token = jsonwebtoken_1.default.sign({
                        _id: newUser._id,
                        type: newUser.userType,
                        isPhoneVerified: newUser === null || newUser === void 0 ? void 0 : newUser.isPhoneVerified,
                        isEmailVerified: newUser === null || newUser === void 0 ? void 0 : newUser.isEmailVerified,
                        status: "Login",
                        generatedOn: (new Date().getTime())
                    }, jwt_token_secret);
                    return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.loginSuccess, { token, userData: newUser }, {}));
                }
                else {
                    //existing user
                    //otp verifed + existing user => send token 
                    const token = jsonwebtoken_1.default.sign({
                        _id: isUser._id,
                        type: isUser.userType,
                        isPhoneVerified: isUser === null || isUser === void 0 ? void 0 : isUser.isPhoneVerified,
                        isEmailVerified: isUser === null || isUser === void 0 ? void 0 : isUser.isEmailVerified,
                        status: "Login",
                        generatedOn: (new Date().getTime())
                    }, jwt_token_secret);
                    return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.loginSuccess, { token, userData: isUser }, {}));
                }
            }
            //acccestoken and idtoken is not valid
            return res.status(401).json(new common_1.apiResponse(401, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.invalidIdTokenAndAccessToken, {}, {}));
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.google_SL = google_SL;
// export const adminSignUp = async (req: Request, res: Response) => {
//     reqInfo(req)
//     try {
//         let body = req.body,
//             otp,
//             otpFlag = 1; // OTP has already assign or not for cross-verification
//         let isAlready = await model.findOne({ email: body?.email, isActive: true, userType : 1  })
//         if (isAlready) return res.status(409).json(new apiResponse(409, responseMessage?.alreadyEmail, {}, {}))
//         if (isAlready?.isBlock == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))
//         const salt = await bcryptjs.genSaltSync(10)
//         const hashPassword = await bcryptjs.hash(body.password, salt)
//         delete body.password
//         body.password = hashPassword
//         body.userType = 1  //to specify this user is admin
//         let response = await new model(body).save()
//         response = {
//             userType: response?.userType,
//             isPhoneVerified: response?.isEmailVerified,
//             _id: response?._id,
//             email: response?.email,
//         }
//         while (otpFlag == 1) {
//             for (let flag = 0; flag < 1;) {
//                 otp = await Math.round(Math.random() * 1000000);
//                 if (otp.toString().length == 6) {
//                     flag++;
//                 }
//             }
//             let isAlreadyAssign = await model.findOne({ otp: otp });
//             if (isAlreadyAssign?.otp != otp) otpFlag = 0;
//         }
//         let result: any = await email_verification_mail(response, otp);
//         if (result) {
//             await model.findOneAndUpdate(body, { otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) })
//             return res.status(200).json(new apiResponse(200, `${result}`, {}, {}));
//         }
//         else return res.status(501).json(new apiResponse(501, responseMessage?.errorMail, {}, `${result}`));
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
//     }
// }
// export const adminLogin = async (req: Request, res: Response) => { //email or password // phone or password
//     let body = req.body,
//         response: any
//     reqInfo(req)
//     try {
//         response = await model.findOneAndUpdate({ email: body?.email, userType: 1, isActive: true }, { isLoggedIn : true }).select('-__v -createdAt -updatedAt')
//         if (!response) return res.status(400).json(new apiResponse(400, responseMessage?.invalidUserPasswordEmail, {}, {}))
//         if (response?.isBlock == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))
//         const passwordMatch = await bcryptjs.compare(body.password, response.password)
//         if (!passwordMatch) return res.status(400).json(new apiResponse(400, responseMessage?.invalidUserPasswordEmail, {}, {}))
//         const token = jwt.sign({
//             _id: response._id,
//             type: response.userType,
//             status: "Login",
//             generatedOn: (new Date().getTime())
//         }, jwt_token_secret)
//         await new userSessionModel({
//             createdBy: response._id,
//         }).save()
//         response = {
//             isEmailVerified: response?.isEmailVerified,
//             userType: response?.userType,
//             _id: response?._id,
//             email: response?.email,
//             token,
//         }
//         return res.status(200).json(new apiResponse(200, responseMessage?.loginSuccess, response, {}))
//     } catch (error) {
//         return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
//     }
// }
const adminSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    try {
        let body = req.body, otp, otpFlag = 1; // OTP has already assign or not for cross-verification
        let isAlready = yield database_1.adminModel.findOne({ email: body === null || body === void 0 ? void 0 : body.email, isActive: true });
        if (isAlready)
            return res.status(409).json(new common_1.apiResponse(409, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.alreadyEmail, {}, {}));
        if ((isAlready === null || isAlready === void 0 ? void 0 : isAlready.isBlock) == true)
            return res.status(403).json(new common_1.apiResponse(403, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.accountBlock, {}, {}));
        const salt = yield bcryptjs_1.default.genSaltSync(10);
        const hashPassword = yield bcryptjs_1.default.hash(body.password, salt);
        delete body.password;
        body.password = hashPassword;
        let response = yield new database_1.adminModel(body).save();
        response = {
            isEmailVerified: response === null || response === void 0 ? void 0 : response.isEmailVerified,
            _id: response === null || response === void 0 ? void 0 : response._id,
            email: response === null || response === void 0 ? void 0 : response.email,
        };
        while (otpFlag == 1) {
            for (let flag = 0; flag < 1;) {
                otp = yield Math.round(Math.random() * 1000000);
                if (otp.toString().length == 6) {
                    flag++;
                }
            }
            let isAlreadyAssign = yield database_1.adminModel.findOne({ otp: otp });
            if ((isAlreadyAssign === null || isAlreadyAssign === void 0 ? void 0 : isAlreadyAssign.otp) != otp)
                otpFlag = 0;
        }
        let result = yield (0, helper_1.email_verification_mail)(response, otp);
        if (result) {
            yield database_1.adminModel.findOneAndUpdate(body, { otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) });
            return res.status(200).json(new common_1.apiResponse(200, `${result}`, {}, {}));
        }
        else
            return res.status(501).json(new common_1.apiResponse(501, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.errorMail, {}, `${result}`));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.adminSignUp = adminSignUp;
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body, response;
    (0, helper_1.reqInfo)(req);
    try {
        response = yield database_1.adminModel.findOneAndUpdate({ email: body === null || body === void 0 ? void 0 : body.email, isActive: true }, { isLoggedIn: true }).select('-__v -createdAt -updatedAt');
        if (!response)
            return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.invalidUserPasswordEmail, {}, {}));
        if ((response === null || response === void 0 ? void 0 : response.isBlock) == true)
            return res.status(403).json(new common_1.apiResponse(403, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.accountBlock, {}, {}));
        const passwordMatch = yield bcryptjs_1.default.compare(body.password, response.password);
        if (!passwordMatch)
            return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.invalidUserPasswordEmail, {}, {}));
        const token = jsonwebtoken_1.default.sign({
            _id: response._id,
            type: response.userType,
            status: "Login",
            generatedOn: (new Date().getTime())
        }, jwt_token_secret);
        yield new database_1.userSessionModel({
            createdBy: response._id,
        }).save();
        response = {
            isEmailVerified: response === null || response === void 0 ? void 0 : response.isEmailVerified,
            _id: response === null || response === void 0 ? void 0 : response._id,
            email: response === null || response === void 0 ? void 0 : response.email,
            token,
        };
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.loginSuccess, response, {}));
    }
    catch (error) {
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.adminLogin = adminLogin;
const admin_otp_verification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let body = req.body;
    try {
        body.isActive = true;
        let data = yield database_1.adminModel.findOne(body);
        if (!data)
            return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.invalidOTP, {}, {}));
        if (data.isBlock == true)
            return res.status(403).json(new common_1.apiResponse(403, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.accountBlock, {}, {}));
        if (new Date(data.otpExpireTime).getTime() < new Date().getTime())
            return res.status(410).json(new common_1.apiResponse(410, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.expireOTP, {}, {}));
        if (data) {
            let response = yield database_1.adminModel.findOneAndUpdate(body, { otp: null, otpExpireTime: null, isEmailVerified: true, isLoggedIn: true }, { new: true });
            const token = jsonwebtoken_1.default.sign({
                _id: response._id,
                type: response.userType,
                status: "Login",
                generatedOn: (new Date().getTime())
            }, jwt_token_secret);
            yield new database_1.userSessionModel({
                createdBy: response._id,
            }).save();
            let result = {
                isEmailVerified: response === null || response === void 0 ? void 0 : response.isEmailVerified,
                _id: response === null || response === void 0 ? void 0 : response._id,
                email: response === null || response === void 0 ? void 0 : response.email,
                token,
            };
            return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.OTPverified, result, {}));
        }
    }
    catch (error) {
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.admin_otp_verification = admin_otp_verification;
//# sourceMappingURL=auth.js.map