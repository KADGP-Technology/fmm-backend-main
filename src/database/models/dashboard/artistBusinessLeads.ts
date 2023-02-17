import { string } from "joi";

const mongoose = require('mongoose')

const artistBusinessLeadsSchema: any = new mongoose.Schema({
    firstName : {type  : String},
    data:{type:String},
    artist:{type : mongoose.Schema.Types.ObjectId , ref : "artist" },
    // businessLeadsCustomer:[{type:mongoose.Types.ObjectId,ref:"user",requireMent:{type:String},location:{type:String}}],
    // businessLeadsCustomer:[{requireMent:{type:String},location:{type:String}}],
    businessLeadsCustomer:[
        {userId:{type:mongoose.Types.ObjectId,ref:"user"},
        requireMent:{type:String},
        location:{type:String},
        date:{type:String}}],

}, { timestamps: true })

export const artistBusinessLeadsModel = mongoose.model('businessLeads', artistBusinessLeadsSchema);