"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.artistBooking = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../../controllers");
const router = express_1.default.Router();
//------------------------------- Bookings Routes -----------------------------------//
router.post("/getBookings", controllers_1.artistDashboardBookings.get_bookings);
router.put("/updateBookings", controllers_1.artistDashboardBookings.update_bookings);
exports.artistBooking = router;
//# sourceMappingURL=bookings.js.map