"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMS_message = exports.file_path = exports.userStatus = exports.apiResponse = void 0;
class apiResponse {
    constructor(status, message, data, error) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.error = error;
    }
}
exports.apiResponse = apiResponse;
exports.userStatus = {
    user: "user",
    admin: "admin",
    upload: "upload",
    artist: "artist"
};
exports.file_path = ['profile', "portfolio"];
exports.SMS_message = {
    OTP_verification: `FMM app verification code:`,
    OTP_forgot_password: `FMM app forgot password verification code:`,
};
//# sourceMappingURL=index.js.map