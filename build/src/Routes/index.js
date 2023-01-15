"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const admin_1 = require("./admin");
const artist_1 = require("./artist");
const upload_1 = require("./upload");
const user_1 = require("./user");
const blog_1 = require("./blog");
const router = (0, express_1.Router)();
exports.router = router;
// const accessControl = (req: Request, res: Response, next: any) => {
//     req.headers.userType = userStatus[req.originalUrl.split('/')[1]]
//     next()
// }
router.use('/user', user_1.userRouter);
router.use('/artist', artist_1.artistRouter);
router.use('/admin', admin_1.adminRouter);
router.use('/upload', upload_1.uploadRouter);
router.use('/blog', blog_1.blogRouter);
//# sourceMappingURL=index.js.map