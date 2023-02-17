import { artistBookingsModel } from './../../database/models/dashboard/artistBooking';
import { artistBusinessLeadsModel } from './../../database/models/dashboard/artistBusinessLeads';

"use strict"
require('dotenv').config()
import { Request, Response } from 'express'
import { artistModel, userModel } from '../../database'
import { apiResponse } from '../../common'
import { responseMessage } from '../../helper'


const ObjectId = require('mongoose').Types.ObjectId



//---------------------------- Dashboard -------------------------------------------//

export const create_bookings = async(req  :Request , res : Response) => {
    console.log("REQUESTT",req.body);
   try {
    // const getArtist = await artistBusinessLeadsModel.findById({_id:req.body._id})
    const createBooking= new artistBookingsModel(req.body).save()
    if(createBooking){
        return res.status(200).json(new apiResponse(200 ,responseMessage?.customMessage("Bookings Created") , createBooking  , {}));
    }

   } catch (error) {
    return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))

   }
}


export const get_bookings = async(req  :Request , res : Response) => {
    const {artistId} = req.body
   try {
    // const getArtist = await artistBusinessLeadsModel.findById({_id:req.body._id})
    const getBookings = await artistBookingsModel.findOne({artist:artistId}).populate({
        path:'customerBookings',
        populate:'userId'
    }).select('firstName')
    return res.status(200).json(new apiResponse(200 ,responseMessage?.customMessage("Bookings fetched") , getBookings  , {}));

   } catch (error) {
    return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))

   }
}

export const update_bookings = async(req  :Request , res : Response) => {
    console.log("REQUESTT business update",req.body);
    var currentdate = new Date(); 
    const {artistId,userId,requireMent,location,} = req.body
    console.log(ObjectId(artistId));
   try {
    const updateBookings = await artistBookingsModel.findOneAndUpdate({artist:artistId},{
        $push:{
            customerBookings
            :{userId,requireMent,location,date:(currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/" 
        + currentdate.getFullYear() ) }},
        requireMent,
        location

    })
    return res.status(200).json(new apiResponse(200 ,responseMessage?.customMessage("Bookings updated") , updateBookings  , {}));

   } catch (error) {
    return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))

   }
}







