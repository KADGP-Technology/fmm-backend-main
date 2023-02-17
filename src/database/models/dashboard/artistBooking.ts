import { string } from "joi";

const mongoose = require('mongoose')

const artistBookings: any = new mongoose.Schema({
    firstName : {type:String},
    data:{type:String},
    artist:{type : mongoose.Schema.Types.ObjectId , ref : "artist" },
    customerBookings:[
        {userId:{type:mongoose.Types.ObjectId,ref:"user"},
        requireMent:{type:String},
        location:{type:String},
        date:{type:String}}],

}, { timestamps: true })

export const artistBookingsModel = mongoose.model('bookings', artistBookings);