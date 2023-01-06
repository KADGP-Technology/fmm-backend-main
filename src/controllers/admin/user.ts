"use strict"
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { apiResponse } from '../../common'
import { artistModel, userModel } from '../../database'
import { reqInfo, responseMessage } from '../../helper'
const ObjectId : any = mongoose.Types.ObjectId

export const get_user_pagination = async (req: Request, res: Response) => {
    reqInfo(req)
    let response: any, { page, limit, search } = req.body, match: any = {};
    try {
        if (search) {
            var nameArray: Array<any> = []
            var phoneArray: Array<any> = []
            search = search.split(" ")
            search.forEach(data => {
                nameArray.push({ firstName: { $regex: data, $options: 'si' } })
                phoneArray.push({ phoneNumber: { $regex: data, $options: 'si' } })
            })
            match.$or = [{ $and: nameArray }, { $and: phoneArray }]
        }
        match.isActive = true
        match.isPhoneVerified = true
        response = await userModel.aggregate([
            { $match: match },
            {
                $facet: {
                    data: [
                        { $sort: { createdAt: -1 } },
                        { $skip: (((page as number - 1) * limit as number)) },
                        { $limit: limit as number },
                        // { $project: { firstName: 1, lastName: 1, profile_image: 1, email: 1, phoneNumber: 1, isuser: 1, isActive: 1, isBlock: 1, loginType: 1, createdAt: 1 } },
                    ],
                    data_count: [{ $count: "count" }]
                }
            },
        ])
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('user'), {
            user_data: response[0].data,
            state: {
                page: page as number,
                limit: limit as number,
                page_limit: Math.ceil(response[0].data_count[0]?.count / (req.body?.limit) as number) || 1,
            }
        }, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_user_by_id = async (req, res) => {
    reqInfo(req)
    let { user } = req.headers,
        body = req.body;
    let    { id } = req.params;
    try {
        const response = await userModel.findOne({_id : ObjectId(id) , isActive : true});
        if (response.length == 0) return res.status(400).json(new apiResponse(400, responseMessage.getDataNotFound("user"), {}, {}));

        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess("user"), response, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}
export const block_user = async (req, res) => {
    reqInfo(req)
    let { user } = req.headers,
        { flag  , id} = req.body;
        
    try {
            const user = await userModel.findOneAndUpdate({_id : ObjectId(id) , isActive : true} , {isBlock :flag} , {new : true})
            if(!user) return res.status(404).json(new apiResponse(404 , responseMessage.getDataNotFound("user") , {} , {}));

            return res.status(200).json(new apiResponse(200 , responseMessage.updateDataSuccess("user") , user , {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}
