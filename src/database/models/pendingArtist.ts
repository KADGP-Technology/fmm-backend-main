const mongoose = require('mongoose')

const pendingArtistSchema: any = new mongoose.Schema({
   
    password: { type: String  },
    //pendingArtist fields
    //1-->dashbord
    profilePhoto : { type  : String},
    firstName : {type  : String},
    lastName : {type  : String},
    gender : {type : Number , enum :[0,1,2]}, //0-->male , 1 --->female 2 -->tranc
    phoneNumber: { type: String},
    email: { type: String },
    bio : {type : String},

    //2-->address
    lat : {type : String},
    long : { type : String},
    houseNumber :  { type  : String},
    area : { type : String},
    landMark : { type : String},
    country : { type : String},
    city : { type : String},
    state :  {type  :String},

    //3-->services
    //3(a)--->specialization
    specialisation :  [{type : String}], 
    //3(b)-->services offerd
    bridalMakeup : {type : Boolean},
    partyMakeup : {type : Boolean},
    bodyFaceArt : { type : Boolean},
    cinematicMakeup :  {type : Boolean},
    highFashionMakeup : { type : Boolean},

    //3(c) --> dropDown services
    bridalMakeupServiceArray : [{type : String}],
    partyMakeupServiceArray :  [{type : String}],
    bodyFaceArtServiceArray : [{type : String}],
    cinematicMakeupServiceArray :[{type : String}],
    highFashionMakeupServiceArray :[{type : String}],


    //later add
    //4-->presaging
    offerHairStyling  : { type : Boolean , default : false},
    serviceStartAt : { type  : Number},
    isCertified : { type : Boolean , default : false},
    certificate : {type : String},
    experience : { type : Number , enum : [0,1,2,3]}, // 0 --> 0 to 2 , 1-->2 to 5 , 2-->5 to 10 , 3 --> 10+ 
    travelToVenue : { type : Number , enum :[0,1,2]}, //0--> locally , 1 --> nationally , 2-->  globally
    usingBrands :  [{ type : String}],
    haveStudio :  {type : Boolean , default : false},
    dontShowBrands : { type : Boolean , default : false},

    //5-->portfolio
    albumName :  {type : String},
    photoes : [{type : String}],
    video :  [{type : String}],


    profileStatus : { type : Number , enum : [0,1,2,3,4]}, //0-->dashbord ,1 -->address , 2 -->services , 3-->presaging ,4-->portfolio

    otp: { type: Number, default: null },
    otpExpireTime: { type: Date, default: null },
    isPhoneVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },

    // userType : { type : Number , default : 1 , enum : [0,1,2]}, // 0 ---> user , 1 -->pendingArtist , 2--> admin
    status : { type : Number , default : 0 , enum : [0,1 ,2]}, //0-->pending , 1 --> verified , 2-->rejected
    isActive: { type: Boolean, default: true },
    isBlock: { type: Boolean, default: false },
    isLoggedIn : { type : Boolean , defailt : false},

}, { timestamps: true })

export const pendingArtistModel = mongoose.model('pendingArtist', pendingArtistSchema);