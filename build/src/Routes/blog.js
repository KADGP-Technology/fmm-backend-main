"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRouter = void 0;
const express_1 = __importDefault(require("express"));
const blogs_js_1 = __importDefault(require("../controllers/blogs/blogs.js"));
const router = express_1.default.Router();
router.get('/get', blogs_js_1.default.getAllblog);
router.get('/:id', blogs_js_1.default.getDetails);
exports.blogRouter = router;
//# sourceMappingURL=blog.js.map