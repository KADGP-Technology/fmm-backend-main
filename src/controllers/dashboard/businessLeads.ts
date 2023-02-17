import { artistBusinessLeadsModel } from './../../database/models/dashboard/artistBusinessLeads';

"use strict"
require('dotenv').config()
import { Request, Response } from 'express'
import { artistModel, userModel } from '../../database'
import { apiResponse } from '../../common'
import { responseMessage } from '../../helper'


const ObjectId = require('mongoose').Types.ObjectId



//---------------------------- Dashboard -------------------------------------------//

export const create_business_leads = async(req  :Request , res : Response) => {
    console.log("REQUESTT",req.body);
   try {
    // const getArtist = await artistBusinessLeadsModel.findById({_id:req.body._id})
    const getBusinessLeads = new artistBusinessLeadsModel(req.body).save()
    if(getBusinessLeads){
        return res.status(200).json(new apiResponse(200 ,responseMessage?.customMessage("Business Leds Created") , getBusinessLeads  , {}));
    }

   } catch (error) {
    return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))

   }
}


export const get_business_leads = async(req  :Request , res : Response) => {
    const {artistId} = req.body
   try {
    // const getArtist = await artistBusinessLeadsModel.findById({_id:req.body._id})
    const getBusinessLeads = await artistBusinessLeadsModel.findOne({artist:artistId}).populate({
        path:'businessLeadsCustomer',
        populate:'userId'
    }).select('firstName')
    return res.status(200).json(new apiResponse(200 ,responseMessage?.customMessage("Business Leds fetched") , getBusinessLeads  , {}));

   } catch (error) {
    return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))

   }
}

export const update_business_leads = async(req  :Request , res : Response) => {
    console.log("REQUESTT business update",req.body);
    var currentdate = new Date(); 
    const {artistId,userId,requireMent,location,} = req.body
    console.log(ObjectId(artistId));
   try {
    const getBusinessLeads = await artistBusinessLeadsModel.findOneAndUpdate({artist:artistId},{
        $push:{businessLeadsCustomer:{userId,requireMent,location,date:(currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/" 
        + currentdate.getFullYear() ) }},
        requireMent,
        location

    })
    return res.status(200).json(new apiResponse(200 ,responseMessage?.customMessage("Business Leds updated") , getBusinessLeads  , {}));

   } catch (error) {
    return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))

   }
}







