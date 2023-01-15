import express from "express";
import { authController, userController } from '../controllers';
import { userJWT } from "../helper";
const router = express.Router();



router.post('/verify/mobile',authController.mobile_verify);
router.post("/verifyOtp", authController.otp_verification);
router.post("/resend/otp", authController.resend_otp);
router.post("/login" , authController.login);
router.post('/signUp',authController.signUp);
router.post("/auth/google" , authController.google_SL);
router.post("/google/auth" , authController.google_SL)


// router.use(userJWT);

//----------------------- Explore Artists ----------------------------------------//
router.post("/artist/get" , userController.get_artist_pagination);
router.post("/artist/make/favourite" , userController.mark_artist_favourite);
router.post("/artist/get/favourite" , userController.get_favourite_artists);


//---------------------------- Profile -------------------------------------------//
router.get("/profile/update" , userController.update_user_profile);
router.get("/profile" , userController.get_user_profile);



// router.post("/logout" , authController.logout);




export const userRouter = router;