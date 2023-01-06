import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { apiResponse } from '../../common'
import { artistModel, userModel } from '../../database'
import { reqInfo, responseMessage } from '../../helper'
const ObjectId: any = mongoose.Types.ObjectId



export const get_artist_pagination = async (req: Request, res: Response) => {
    reqInfo(req)
    let response: any, { page, limit, search , statusFilter , blockFilter} = req.body, match: any = {};
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
        if(statusFilter) match.status = statusFilter;
        if(blockFilter) match.isBlock = blockFilter;
        match.isActive = true
        response = await artistModel.aggregate([
            { $match: match },
            {
                $facet: {
                    data: [
                        { $sort: { createdAt: -1 } },
                        { $skip: (((page as number - 1) * limit as number)) },
                        { $limit: limit as number },
                        // { $project: { notification: 0, deviceToken: 0, otp: 0, otpExpireTime: 0, authToken: 0, countryCode: 0 } },
                    ],
                    data_count: [{ $count: "count" }]
                }
            },
        ])
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('artist'), {
            artist_data: response[0].data,
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


export const get_artist_by_id = async (req, res) => {
    reqInfo(req)
    let { user } = req.headers,
        body = req.body;
    let    { id } = req.params;
    try {
        const response = await artistModel.findOne({_id : ObjectId(id) , isActive : true});
        if (response.length == 0) return res.status(400).json(new apiResponse(400, responseMessage.getDataNotFound("artist"), {}, {}));

        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess("artist"), response, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}
export const block_artist = async (req, res) => {
    reqInfo(req)
    let { user } = req.headers,
        { flag  , id} = req.body;
        
    try {
        console.log(id);
            const user = await artistModel.findOneAndUpdate({_id : ObjectId(id) , isActive : true} , {isBlock :flag} , {new : true})
            if(!user) return res.status(404).json(new apiResponse(404 , responseMessage.getDataNotFound("artist") , {} , {}));

            return res.status(200).json(new apiResponse(200 , responseMessage.updateDataSuccess("artist") , user , {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const update_artist_status_by_id = async (req, res) => { //1)pending to active 2)active to pending
    reqInfo(req)
    let { user } = req.headers,
        { id , status } = req.body
    try {
        user = await artistModel.findOneAndUpdate({_id : ObjectId(id) , isActive : true} , {status : status} , {new : true})
        if(!user) return res.status(404).json(new apiResponse(404 , responseMessage.getDataNotFound("user") , {} , {}));

        return res.status(200).json(new apiResponse(200 , responseMessage.updateDataSuccess("status") , user , {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}