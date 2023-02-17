import express from "express";
import { artistDashboardBookings } from '../../controllers';
const router = express.Router();




//------------------------------- Bookings Routes -----------------------------------//
router.post("/getBookings" , artistDashboardBookings.get_bookings);
router.put("/updateBookings" , artistDashboardBookings.update_bookings);




export const artistBooking = router;