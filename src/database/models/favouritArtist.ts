const mongoose = require('mongoose')

const favouriteArtistSchema: any = new mongoose.Schema({

createdFor : {type : mongoose.Schema.Types.ObjectId , ref : "artist"},
createdBy : {type : mongoose.Schema.Types.ObjectId , ref : "user" },
isFavourite : {type : Boolean , default : true}

}, { timestamps: true })

export const favouriteArtistModel = mongoose.model('favouriteArtist', favouriteArtistSchema);