import express from 'express'
import { adminController, authController } from '../controllers'
import { userJWT } from '../helper'
const router = express.Router()



router.post('/signup', authController.adminSignUp)
router.post('/login', authController.adminLogin)
router.post("/verify_otp", authController.admin_otp_verification);


//------------- Users Routes -------------------------------//
router.post('/get/user', adminController.get_user_pagination)
router.get('/user/:id', adminController.get_user_by_id)
router.post('/user/block', adminController.block_user)




//------------- Artists Routes -------------------------------//
router.post('/get/artist', adminController.get_artist_pagination)
router.get('/artist/:id', adminController.get_artist_by_id)
router.post('/artist/block', adminController.block_artist)
router.post('/artist/update/status', adminController.update_artist_status_by_id)










export const adminRouter = router;