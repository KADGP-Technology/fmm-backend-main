
"use strict"
require('dotenv').config()
import { Request, Response } from 'express'
import { artistModel, userModel } from '../../database'
import { apiResponse } from '../../common'
import {  reqInfo, responseMessage } from '../../helper'

const ObjectId = require('mongoose').Types.ObjectId


export const updateProfile = async(req  :Request , res : Response) =>
{
    reqInfo(req);
    let body = req.body,
        {user} : any = req.headers;
        console.log(user);
        try{
            const profile  = await artistModel.findOneAndUpdate({isActive : true , _id : ObjectId(user?._id) } , body , { new : true})
            if(!profile) return res.status(404).json(new apiResponse(404 , responseMessage.updateDataError("artist profile") , {} , {}))

            return res.status(200).json(new apiResponse(200 , responseMessage?.updateDataSuccess("artist profile") , profile , {}));
        }catch (error) {
            console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }

}

export const get_by_id_profile = async(req,res)=>
{
        reqInfo(req)
        let { user } = req.headers,
            body = req.body;
        try {
            const response = await artistModel.findOne({isActive : true ,_id : ObjectId(user._id)});
            if (response.length == 0) return res.status(400).json(new apiResponse(400, responseMessage.getDataNotFound("user profile"), {}, {}));
    
            return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess("profiles"), response, {}));
        } catch (error) {
            console.log(error);
            return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
        }
    }

