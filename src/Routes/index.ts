
"use strict"
import { Request, Router, Response } from 'express'
import { userStatus } from '../common'
import { adminRouter } from './admin'
import { artistRouter } from './artist'
import { uploadRouter } from './upload'
import { userRouter } from './user'
import { blogRouter } from './blog'
import { artistBusinessLeads} from './dashboard/businessLeads'
import { artistBooking } from './dashboard/bookings'


const router = Router()
// const accessControl = (req: Request, res: Response, next: any) => {
//     req.headers.userType = userStatus[req.originalUrl.split('/')[1]]
//     next()
// }
router.use('/user',userRouter)
router.use('/artist',artistRouter)
router.use('/admin',adminRouter)
router.use('/upload', uploadRouter)
router.use('/blog', blogRouter);
router.use('/businessLeads', artistBusinessLeads);
router.use('/bookings', artistBooking);







export { router }