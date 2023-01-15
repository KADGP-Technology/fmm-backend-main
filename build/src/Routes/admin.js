"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
router.post('/signup', controllers_1.authController.adminSignUp);
router.post('/login', controllers_1.authController.adminLogin);
router.post("/verify_otp", controllers_1.authController.admin_otp_verification);
//------------- Users Routes -------------------------------//
router.post('/get/user', controllers_1.adminController.get_user_pagination);
router.get('/user/:id', controllers_1.adminController.get_user_by_id);
router.post('/user/block', controllers_1.adminController.block_user);
//------------- Artists Routes -------------------------------//
router.post('/get/artist', controllers_1.adminController.get_artist_pagination);
router.get('/artist/:id', controllers_1.adminController.get_artist_by_id);
router.post('/artist/block', controllers_1.adminController.block_artist);
router.post('/artist/update/status', controllers_1.adminController.update_artist_status_by_id);
exports.adminRouter = router;
//# sourceMappingURL=admin.js.map