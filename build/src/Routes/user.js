"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
router.post('/verify/mobile', controllers_1.authController.mobile_verify);
router.post("/verifyOtp", controllers_1.authController.otp_verification);
router.post("/resend/otp", controllers_1.authController.resend_otp);
router.post("/login", controllers_1.authController.login);
router.post('/signUp', controllers_1.authController.signUp);
router.post("/auth/google", controllers_1.authController.google_SL);
router.post("/google/auth", controllers_1.authController.google_SL);
// router.use(userJWT);
//----------------------- Explore Artists ----------------------------------------//
router.post("/artist/get", controllers_1.userController.get_artist_pagination);
router.post("/artist/make/favourite", controllers_1.userController.mark_artist_favourite);
router.post("/artist/get/favourite", controllers_1.userController.get_favourite_artists);
//---------------------------- Profile -------------------------------------------//
router.get("/profile/update", controllers_1.userController.update_user_profile);
router.get("/profile", controllers_1.userController.get_user_profile);
// router.post("/logout" , authController.logout);
exports.userRouter = router;
//# sourceMappingURL=user.js.map