import express from "express";
import { userJWT } from "../helper";
import blogcontrol from "../controllers/blogs/blogs.js";
const router = express.Router();

router.get('/get', blogcontrol.getAllblog);
router.get('/:id', blogcontrol.getDetails)


export const blogRouter = router;