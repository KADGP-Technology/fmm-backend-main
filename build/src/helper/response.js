"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseMessage = void 0;
exports.responseMessage = {
    loginSuccess: "Login successful!",
    signupSuccess: "Account created successful!",
    onlyUserRegister: "Only user can register!",
    internalServerError: "Internal Server Error!",
    alreadyEmail: "Email is already registered!",
    emailUnverified: "enter the OTP below  to verify  your Email address!",
    accountBlock: "Your account has been blocked!",
    invalidUserPasswordEmail: "You have entered an invalid username or password!",
    invalidOTP: "Invalid OTP!",
    expireOTP: "OTP has been expired!",
    OTPverified: "OTP has been verified successfully!",
    invalidEmail: "You have entered an invalid email!",
    emailVerificationComplete: "Email verification complete!",
    invalidIdTokenAndAccessToken: "You have entered an invalid idToken or accessToken!",
    errorMail: "Error in mail system!",
    resetPasswordSuccess: "Your password has been successfully reset!",
    resetPasswordError: "Error in reset password!",
    oldPasswordError: "You have entered the old password wrong!",
    passwordChangeSuccess: "Password has been changed!",
    passwordChangeError: "During password changing error in database!",
    invalidOldTokenReFreshToken: "You have entered an invalid old token or refresh token!",
    refreshTokenNotFound: "Refresh token not found!",
    tokenNotExpire: "Token has been not expired!",
    tokenExpire: "Token has been expired!",
    refreshTokenSuccess: "A new token has been successfully generated!",
    differentToken: "Do not try a different token!",
    tokenNotFound: "We can't find tokens in header!",
    logout: "Logout Successful!",
    fileUploadSuccess: "Your requested file uploaded successfully!",
    addDataError: "Oops! Something went wrong!",
    buySubscription: 'Please buy a subscription!',
    buyCommercialLicense: 'Please buy a commercial license!',
    commercialLicenseNotExist: `You've request post commercial license does not exist! Please pass valid params`,
    extendedLicenseNotExist: `You've request post extended license does not exist! Please pass valid params`,
    buyExtendedLicense: 'Please buy a extended license!',
    downloadLimit: "Your download limit of 10 exceed!",
    paymentSuccess: "Payment successful!",
    purchaseSuccess: "purchase successful!",
    paymentFailed: "Payment fail!",
    decryptionError: "Please pass a valid encryption string!",
    decryptionSuccess: "Your data successfully decrypted!",
    encryptionSuccess: "Your data successfully encrypted!",
    encryptionError: "Please pass a valid decryption string!",
    accessDenied: "Access denied",
    invalidToken: "Invalid token",
    customMessage: (message) => { return `${message[0].toUpperCase() + message.slice(1).toLowerCase()}`; },
    invalidId: (message) => { return `invalid ${message}!`; },
    dataAlreadyExist: (message) => { return `Please change ${message}, ${message} is already exists!`; },
    getDataSuccess: (message) => { return `${message[0].toUpperCase() + message.slice(1).toLowerCase()} successfully retrieved!`; },
    addDataSuccess: (message) => { return `${message[0].toUpperCase() + message.slice(1).toLowerCase()} successfully added!`; },
    getDataNotFound: (message) => { return `We couldn't find the ${message.toLowerCase()} you requested!`; },
    updateDataSuccess: (message) => { return `${message[0].toUpperCase() + message.slice(1).toLowerCase()} has been successfully updated!`; },
    updateDataError: (message) => { return `${message[0].toUpperCase() + message.slice(1).toLowerCase()} updating time getting an error!`; },
    deleteDataSuccess: (message) => { return `Your ${message.toLowerCase()} has been successfully deleted!`; },
};
//# sourceMappingURL=response.js.map