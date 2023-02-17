
"use strict"
require('dotenv').config()
import { Request, Response } from 'express'
import { artistModel, userModel } from '../../database'
import { apiResponse } from '../../common'
import {  reqInfo, responseMessage } from '../../helper'
import bodyParser from 'body-parser'
import { favouriteArtistModel } from '../../database/models/favouritArtist'

const ObjectId = require('mongoose').Types.ObjectId


export const get_artist_pagination = async(req  :Request , res : Response) => {
    reqInfo(req)
    let { user } = req.headers,
        { page, limit, search ,
          partyMakeup , bridalMakeup , bodyFaceArt, cinematicMakeup , highFashionMakeup,
          priceRange,
          experience,
          certifiedOnly,
          verifiedOnly,
          travelToVenue,
          offerHairStyling,
          offerInStudioService,
        } = req.body,match: any = {};
    try {
        // if (search) {
        //     var nameArray: Array<any> = []
        //     search = search.split(" ")
        //     search.forEach(data => {
        //         nameArray.push({ name: { $regex: data, $options: 'si' } })
        //     })
        //     match.$or = [{ $and: nameArray }]
        // }
        if(partyMakeup) match.partyMakeup = true;
        if(bridalMakeup) match.bridalMakeup = true;
        if(bodyFaceArt) match.bodyFaceArt = true;
        if(cinematicMakeup) match.cinematicMakeup = true;
        if(highFashionMakeup) match.highFashionMakeup = true;
        if(priceRange.min != "") match.serviceStartAt = {$gte : priceRange.min , $lt : priceRange.max};
        if(experience?.length > 0) match.experience= {$in: experience } ;
        if(certifiedOnly) match.isCertified = true;
        if(verifiedOnly) match.status = 1;
        if(offerHairStyling) match.offerHairStyling = true;
        if(travelToVenue == 0 || travelToVenue) match.travelToVenue = travelToVenue;
        if(offerInStudioService) match.haveStudio = true;

        // match.status = 1; to get only verfied artists
        match.isBlock = false;
        console.log(match);
        const artist = await artistModel.aggregate([
            {$match : match } ,
            {
                $facet: {
                    data: [
                        { $sort: { createdAt: -1 } },
                        { $skip: (((page as number - 1) * limit as number)) },
                        { $limit: limit as number },
                    ],
                    data_count: [{ $count: "count" }]
                }
            },
        ])

        if(artist[0].data.length == 0) return res.status(404).json(new apiResponse(404 , responseMessage.getDataNotFound("artist") , {} , {}))

        return res.status(200).json(new apiResponse(200 ,responseMessage.getDataSuccess("artist") , {
            artistData: artist[0].data,
            state: {
                page: page as number,
                limit: limit as number,
                page_limit: Math.ceil(artist[0].data_count[0]?.count / (req.body?.limit) as number) || 1,
            }
        } , {} ));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}


//---------------------------- Dashboard -------------------------------------------//

export const get_artist = async(req  :Request , res : Response) => {
    console.log("REQUESTT",req.body);
   try {
    const getArtist = await artistModel.findById({_id:req.body._id})
    return res.status(200).json(new apiResponse(200 ,responseMessage?.customMessage("Artist fetched") , getArtist  , {}));

   } catch (error) {
    return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))

   }
}


export const mark_artist_favourite = async(req  :Request , res : Response) => {
    reqInfo(req)
    let { user }  : any = req.headers,
        body = req.body,
        {createdFor , isFavourite } = req.body;
    try{

        let updatedDoc = await  favouriteArtistModel.findOneAndUpdate({createdFor :ObjectId(createdFor) , createdBy : ObjectId(user._id)} , {isFavourite : isFavourite} , {new  : true});
        if(!updatedDoc)
        {
            body.createdBy = ObjectId(user._id)
            console.log(body);
            let newDoc = await new favouriteArtistModel(body).save();
            if(!newDoc) return res.status(404).json(new apiResponse(404 , responseMessage?.addDataError, {} ,{}))
            return res.status(200).json(new apiResponse(200 ,responseMessage?.addDataSuccess("favourite Artist") , newDoc  , {}));
        }
        
        if(!updatedDoc) return res.status(404).json(new apiResponse(404 , responseMessage?.updateDataError("favourite artist"), {} ,{}))
        return res.status(200).json(new apiResponse(200 ,responseMessage?.updateDataSuccess("favourite Artist") , updatedDoc  , {}));
       
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}




export const get_favourite_artists = async(req  :Request , res : Response) => {
    reqInfo(req)
    let { user }  : any = req.headers,
        body = req.body;
        
    try{
            const fav_artists = await favouriteArtistModel.find({createdBy : ObjectId(user._id) , isFavourite : true}).populate("createdBy createdBy" );
            if(fav_artists.length == 0)  return res.status(404).json(new apiResponse(404 , responseMessage?.getDataNotFound("favourite artist"), {} ,{}))

            return res.status(200).json(new apiResponse(200 ,responseMessage?.getDataSuccess("favourite Artist") , fav_artists  , {}));
} catch (error) {
    console.log(error);
    return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
}
}
