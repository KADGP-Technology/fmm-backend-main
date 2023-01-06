"use strict"
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { apiResponse } from '../../common'
import { artistModel, userModel } from '../../database'
import { reqInfo, responseMessage } from '../../helper'
const ObjectId : any = mongoose.Types.ObjectId
import bcryptjs from 'bcryptjs'



export const get_user_profile = async (req, res) => {
    reqInfo(req)
    let { user } = req.headers,
        body = req.body;
        
    try {
        const response = await userModel.findOne({_id : ObjectId(user._id) , isActive : true});
        if (response.length == 0) return res.status(400).json(new apiResponse(400, responseMessage.getDataNotFound("user"), {}, {}));

        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess("user"), response, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const update_user_profile = async (req, res) => {
    reqInfo(req)
    let { user } = req.headers,
        body = req.body;
    try {
        const salt = await bcryptjs.genSaltSync(10)
        const hashPassword = await bcryptjs.hash(body.password, salt)
        delete body.password
        body.password = hashPassword
        const response = await userModel.findOneAndUpdate({_id : ObjectId(user._id) , isActive : true} , body , {new : true});
        if (response.length == 0) return res.status(400).json(new apiResponse(400, responseMessage.updateDataError("user"), {}, {}));

        return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess("user"), response, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}