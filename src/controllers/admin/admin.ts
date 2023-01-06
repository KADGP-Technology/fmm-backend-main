"use strict"
require('dotenv').config()

import { Request, Response } from 'express'
import { apiResponse,  } from '../../common'
import { adminModel } from '../../database'
import { reqInfo, responseMessage } from '../../helper'

const ObjectId = require('mongoose').Types.ObjectId


export const admin_editProfile = async (req: Request, res: Response) => {
    reqInfo(req)
    let body = req.body,
        { user }: any = req.headers;
    try {
        const response = await adminModel.findOneAndUpdate({ _id: ObjectId(user._id),userType : 1, isActive: true }, body, { new: true });
        if (!response) return res.status(404).json(new apiResponse(400, responseMessage.updateDataError("profile"), {}, {}));
        return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess("profile"), response, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_admin_profile = async (req: Request, res: Response) => {
    reqInfo(req)
    let body = req.body,
        { user }: any = req.headers;
    try {
              const adminProfile = await adminModel.findOne({_id : ObjectId(user._id) , isActive : true});
                if(!adminProfile) return res.status(404).json(new apiResponse(404 , responseMessage.getDataNotFound("admin") , {} , {}))

                return res.status(200).json(new apiResponse(200 , responseMessage.getDataSuccess("profile") , adminProfile , {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}



export const admin_logout = async (req: Request, res: Response) => {
    reqInfo(req)
    let body = req.body,
        { user }: any = req.headers;
    try {

        const userData = await adminModel.findOne({_id : ObjectId(user._id) , isActive : true , userType : 1} , {isloggedIn :false})
        if(!userData) return res.status(404).json(new apiResponse(404 , responseMessage.getDataNotFound("admin") , {} , {}));

        return res.status(200).json(new apiResponse(200 , responseMessage.logout , {} , {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}