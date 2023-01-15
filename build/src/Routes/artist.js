"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.artistRouter = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const helper_1 = require("../helper");
const router = express_1.default.Router();
router.use(helper_1.artistJWT);
//------------------------------- Profile Routes -----------------------------------//
router.post("/update/profile", controllers_1.artistController.updateProfile);
router.get("/profile", controllers_1.artistController.get_by_id_profile);
exports.artistRouter = router;
//# sourceMappingURL=artist.js.map