import express from "express";
import { artistController, authController } from '../controllers';
import { artistJWT } from "../helper";
const router = express.Router();


router.use(artistJWT);

//------------------------------- Profile Routes -----------------------------------//
router.post("/update/profile" , artistController.updateProfile);
router.get("/profile" , artistController.get_by_id_profile);



export const artistRouter = router;