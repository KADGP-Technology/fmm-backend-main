"use strict"
require('dotenv').config()
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { Request, Response } from 'express'
import { adminModel, artistModel, userModel, userSessionModel } from '../../database'
import { apiResponse, SMS_message } from '../../common'
import {  email_verification_mail, reqInfo, responseMessage, sendSMS } from '../../helper'
import axios from 'axios'

const ObjectId = require('mongoose').Types.ObjectId
const jwt_token_secret = process.env.JWT_TOKEN_SECRET

const specify_model_asper_role = (userType) => {
    if (userType == 0) return userModel;
    if (userType == 1) return artistModel;
    // if (userType == 2) return adminModel;
    return null;
}

export const mobile_verify_for_signup = async (req: Request, res: Response) => { //mobile & usertype
    reqInfo(req)
    console.log(req.body)
    let body = req.body,
        otp,
        otpFlag = 1, // OTP has already assign or not for cross-verification
        authToken = 0;
        let model = specify_model_asper_role(body.userType);
        if (!model) return res.status(404).json(new apiResponse(404, "please provide appropriate userType", {}, {}));
        
        const isAlreadyUser = await model.findOne({ phoneNumber: body?.phoneNumber, isPhoneVerified: true })

        if(isAlreadyUser){
            return res.json({status:302, message:"User is already registred"});
        }
        else{
            try {
                const isAlready = await model.findOne({ phoneNumber: body?.phoneNumber, isActive: true })
                if(isAlready?.isPhoneVerified == false) {
                  const data2 =  await model.findOneAndDelete({ phoneNumber: body?.phoneNumber, isActive: true })
                  console.log(data2);
               }
                   
               if (isAlready?.isBlock == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))
             
               let response = await new model(body).save()
              
               while (otpFlag == 1) {
                   for (let flag = 0; flag < 1;) {
                       otp = await Math.round(Math.random() * 1000000);
                       if (otp.toString().length == 6) {
                           flag++;
                       }
                   }
                   let isAlreadyAssign = await model.findOne({ otp: otp });
                   if (isAlreadyAssign?.otp != otp) otpFlag = 0;
               }
                //here send otp via sns ....
                let result: any =  await sendSMS("91", response?.phoneNumber, `${SMS_message.OTP_verification} ${otp}`)
                if (result) {
                   // console.log(result);
                   await model.findOneAndUpdate(body, { otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) })
                   return res.status(200).json(new apiResponse(200, `OTP send succesfully to ${response?.phoneNumber}`, {}, {}));
               }
               else return res.status(501).json(new apiResponse(501, responseMessage?.errorMail, {}, `${result}`));
           
           
               } catch (error) {
                   console.log(error);
                   return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
               }
        } 
}


export const mobile_verify = async (req: Request, res: Response) => { //mobile & usertype
    reqInfo(req)
    console.log(req.body)
    let body = req.body,
        otp,
        otpFlag = 1, // OTP has already assign or not for cross-verification
        authToken = 0;
        let model = specify_model_asper_role(body.userType);
        if (!model) return res.status(404).json(new apiResponse(404, "please provide appropriate userType", {}, {}));
    

    try {
     const isAlready = await model.findOne({ phoneNumber: body?.phoneNumber, isActive: true })
     if(isAlready?.isPhoneVerified == false) {
       const data2 =  await model.findOneAndDelete({ phoneNumber: body?.phoneNumber, isActive: true })
       console.log(data2);
    }
    if (isAlready?.isPhoneVerified == true) 
    {
        while (otpFlag == 1) {
            for (let flag = 0; flag < 1;) {
                otp = await Math.round(Math.random() * 1000000);
                if (otp.toString().length == 6) {
                    flag++;
                }
            }
            let isAlreadyAssign = await model.findOne({ otp: otp });
            if (isAlreadyAssign?.otp != otp) otpFlag = 0;
        }
         //here send otp via sns ....
         let result: any =  await sendSMS("91", isAlready?.phoneNumber, `${SMS_message.OTP_verification} ${otp}`)
         if (result) {
            // console.log(result);
            await model.findOneAndUpdate(body, { otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) })
            return res.status(200).json(new apiResponse(200, `OTP sened succesfully to ${isAlready?.phoneNumber}`, {}, {}));
        }
        else return res.status(501).json(new apiResponse(501, responseMessage?.errorMail, {}, `${result}`));
    
        }
        if(isAlready?.isPhoneVerified == true && isAlready?.profileStatus == 4)
            return res.status(409).json(new apiResponse(409, "phone number exist already", {}, {}))

    if (isAlready?.isBlock == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))
  
    let response = await new model(body).save()
    // response = {
    //     userType: response?.userType,
    //     isEmailVerified: response?.isEmailVerified,
    //     isPhoneVerified : response?.isPhoneVerified,
    //     _id: response?._id,
    //     phoneNumber: response?.phoneNumber,
    // }

    while (otpFlag == 1) {
        for (let flag = 0; flag < 1;) {
            otp = await Math.round(Math.random() * 1000000);
            if (otp.toString().length == 6) {
                flag++;
            }
        }
        let isAlreadyAssign = await model.findOne({ otp: otp });
        if (isAlreadyAssign?.otp != otp) otpFlag = 0;
    }
     //here send otp via sns ....
     let result: any =  await sendSMS("91", response?.phoneNumber, `${SMS_message.OTP_verification} ${otp}`)
     if (result) {
        // console.log(result);
        await model.findOneAndUpdate(body, { otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) })
        return res.status(200).json(new apiResponse(200, `OTP sened succesfully to ${response?.phoneNumber}`, {}, {}));
    }
    else return res.status(501).json(new apiResponse(501, responseMessage?.errorMail, {}, `${result}`));


    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const otp_verification = async (req: Request, res: Response) => { //phonenumber & otp
    reqInfo(req)
    let body = req.body
    let model = specify_model_asper_role(body.userType);
    if (!model) return res.status(404).json(new apiResponse(404, "please provide appropriate userType", {}, {}));
    try {
        body.isActive = true
    
        let data = await model.findOne(body);
        if (!data) return res.send({status:302, message:"OTP is not same"})
        if (data.isBlock == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))
        if (new Date(data.otpExpireTime).getTime() < new Date().getTime()) return res.status(410).json(new apiResponse(410, responseMessage?.expireOTP, {}, {}))
        
            let userData = await model.findOneAndUpdate(body, { otp: null, otpExpireTime: null, isPhoneVerified: true , isLoggedIn : true}, { new: true });
            
            const token = jwt.sign({
                _id: userData._id,
                type: userData.userType,
                status: "Login",
                generatedOn: (new Date().getTime())
            }, jwt_token_secret)
    
            await new userSessionModel({
                createdBy: userData._id,
            }).save()
            
            let result = {
                data : userData,
                token,
            }
            return res.status(200).json(new apiResponse(200, responseMessage?.OTPverified, result, {}))
        

    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const resend_otp = async (req, res) => {
    reqInfo(req)
    let body = req.body,
        otp,
        otpFlag = 1, // OTP has already assign or not for cross-verification
        authToken = 0;
        let model = specify_model_asper_role(body.userType);
        if (!model) return res.status(404).json(new apiResponse(404, "please provide appropriate userType", {}, {}));

    try {
        //resetting otp
        while (otpFlag == 1) {
            for (let flag = 0; flag < 1;) {
                otp = await Math.round(Math.random() * 1000000);
                if (otp.toString().length == 6) {
                    flag++;
                }
            }
            let isAlreadyAssign = await model.findOne({ otp: otp });
            if (isAlreadyAssign?.otp != otp) otpFlag = 0;
        }
    

        const response = await model.findOneAndUpdate({ phoneNumber: body?.phoneNumber, isActive: true }, { otp: otp,otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)), isOTPVerified: false });
        if (!response) {
            return res.status(404).json(new apiResponse(404, "invalid mobile!", null, {}))
        }

        //user saved succesfully now send otp to the user
        let result: any =  await sendSMS("91", response?.phoneNumber, `${SMS_message.OTP_verification} ${otp}`)

        if (!result) {
            //tap on resend otp
            await model.findOneAndUpdate({ email: response.email }, { otp: null, otpExpierTime: null });
            return res.status(501).json(new apiResponse(501, "error in sending otp from server tap on resend otp", {}, {}));
        }
        //otp sended
        return res.status(200).json(new apiResponse(200, `OTP sened succesfully to ${response?.phoneNumber}`, {}, {}));
    }
    catch (error) {
        console.log("error", error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, null, error))
    }
}


export const signUp = async (req: Request, res: Response) => {
    reqInfo(req)
    console.log("BODDDY",req.body,req.body.userType)
    let body = req.body;
    let model = specify_model_asper_role(body.userType);
    console.log('Model',model);
    if (!model) return res.status(404).json(new apiResponse(404, "please provide appropriate userType", {}, {}));
    try {
        // const salt = await bcryptjs.genSaltSync(10)
        // const hashPassword = await bcryptjs.hash(body.password, salt)
        // delete body.password
        // body.password = hashPassword
        console.log("USSSER");
         let userData = await model.findOneAndUpdate({isActive : true , phoneNumber : body.phoneNumber , isPhoneVerified : true} , body , { new : true});
        console.log("USERDATA",userData);
        if(!userData){
            const createUser = await new model(req.body).save()
            console.log("CREATEUSER",createUser);
            if(!createUser) return res.status(404).json(new apiResponse(400 , "Account Not Created" , {} , {}))
            else{
                res.status(200).json(new apiResponse(200, responseMessage?.signupSuccess, createUser, {}))
            }
        }
        
     
        return res.status(200).json(new apiResponse(200, responseMessage?.signupSuccess, userData, {}))
       
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}


// export const signUp = async (req: Request, res: Response) => {
//     reqInfo(req)
//     console.log("BODDDY",req.body,req.body.userType)
//     let body = req.body;
//     let model = specify_model_asper_role(body.userType);
//     console.log('Model',model);
//     if (!model) return res.status(404).json(new apiResponse(404, "please provide appropriate userType", {}, {}));
//     try {
//         const salt = await bcryptjs.genSaltSync(10)
//         const hashPassword = await bcryptjs.hash(body.password, salt)
//         delete body.password
//         body.password = hashPassword
//          let userData = await model.findOneAndUpdate({isActive : true , phoneNumber : body.phoneNumber , isPhoneVerified : true} , body , { new : true});
//         console.log("USERDATA",userData);
//         if(!userData){
//             const createUser = await new model(req.body).save()
//             console.log("CREATEUSER",createUser);
//             if(!createUser) return res.status(404).json(new apiResponse(400 , "Account Not Created" , {} , {}))
//             else{
//                 res.status(200).json(new apiResponse(200, responseMessage?.signupSuccess, createUser, {}))
//             }
//         }
        
     
//         return res.status(200).json(new apiResponse(200, responseMessage?.signupSuccess, userData, {}))
       
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
//     }
// }
export const login = async (req: Request, res: Response) => {  //phoneNumber only
    reqInfo(req)
    console.log(req.body)
    let body = req.body,
        otp,
        otpFlag = 1, // OTP has already assign or not for cross-verification
        authToken = 0,
        response: any;

        let model = specify_model_asper_role(body.userType);
        if (!model) return res.status(404).json(new apiResponse(404, "please provide appropriate userType", {}, {}));
    try {
        // if(body.userType == 1) 
         response = await model.findOne({ phoneNumber: body?.phoneNumber, isActive: true  , isPhoneVerified : true });
        if (!response) return res.send({status:404, message:"Mobile Number Is Not Registerd!"})

        // if(body.userType == 1)
        // {
        //    let check2 = await model.findOne({ phoneNumber: body?.phoneNumber, isActive: true  , isPhoneVerified : true , profileStatus : 4});
        //     if (!check2) return res.status(405).json(new apiResponse(405, "Please Complete Signup First!", response, {}))
        // }
        
        if (response?.isBlock == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))

        while (otpFlag == 1) {
            for (let flag = 0; flag < 1;) {
                otp = await Math.round(Math.random() * 1000000);
                if (otp.toString().length == 6) {
                    flag++;
                }
            }
            let isAlreadyAssign = await model.findOne({ otp: otp });
            if (isAlreadyAssign?.otp != otp) otpFlag = 0;
        }
         //here send otp via sns ....
         let result: any =  await sendSMS("91", response?.phoneNumber, `${SMS_message.OTP_verification} ${otp}`)
         if (result) {
        
            await model.findOneAndUpdate({phoneNumber : body?.phoneNumber}, { otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10))})
            return res.status(200).json(new apiResponse(200, `OTP sened succesfully to ${response?.phoneNumber}`, {}, {}));
        }
        else return res.status(501).json(new apiResponse(501, responseMessage?.errorMail, {}, `${result}`));

    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const google_SL = async (req: Request, res: Response) => {  //role accessToken and idtoken
    reqInfo(req);
    let body = req.body;
    let { accessToken, idToken } = req.body;
    let model = specify_model_asper_role(body.userType);
    if (!model) return res.status(404).json(new apiResponse(404, "please provide appropriate userType", {}, {}));
  
    try {
        if (accessToken && idToken) {
            let verificationAPI = `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`,
                idAPI = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;

            let access_token: any = await axios.get(verificationAPI)
                .then((result) => {
                    return result.data
                }).catch((error) => {
                    return false;
                })
            let id_token: any = await axios.get(idAPI)
                .then((result) => {
                    return result.data
                }).catch((error) => {
                    return false
                })
            if (access_token.email == id_token.email && access_token.verified_email == true) {

                const isUser = await model.findOne({ email: id_token?.email, isActive: true })
                if (!isUser) {
                    //new user
                
                    let response = {
                        email: id_token.email,
                        firstName: id_token.given_name,
                        lastName : id_token.family_name,
                        image: id_token.picture,
                        isEmailVerified: true,
                        // _id: isUser?._id,
                        logintype: "google"
                    }
                    const newUser = await model(response).save();
                    const token = jwt.sign({
                        _id: newUser._id,
                        type: newUser.userType,
                        isPhoneVerified: newUser?.isPhoneVerified,
                        isEmailVerified : newUser?.isEmailVerified,
                        status: "Login",
                        generatedOn: (new Date().getTime())
                    }, jwt_token_secret)

                    return res.status(200).json(new apiResponse(200, responseMessage?.loginSuccess, { token, userData: newUser }, {}));

                } else {
                    //existing user
                    //otp verifed + existing user => send token 
                    const token = jwt.sign({
                        _id: isUser._id,
                        type: isUser.userType,
                        isPhoneVerified: isUser?.isPhoneVerified,
                        isEmailVerified : isUser?.isEmailVerified,
                        status: "Login",
                        generatedOn: (new Date().getTime())
                    }, jwt_token_secret)
                    return res.status(200).json(new apiResponse(200, responseMessage?.loginSuccess, { token, userData: isUser }, {}));
                }
            }
            //acccestoken and idtoken is not valid
            return res.status(401).json(new apiResponse(401, responseMessage?.invalidIdTokenAndAccessToken, {}, {}))
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error));
    }
}


// export const adminSignUp = async (req: Request, res: Response) => {
//     reqInfo(req)
//     try {
//         let body = req.body,
//             otp,
//             otpFlag = 1; // OTP has already assign or not for cross-verification
//         let isAlready = await model.findOne({ email: body?.email, isActive: true, userType : 1  })
//         if (isAlready) return res.status(409).json(new apiResponse(409, responseMessage?.alreadyEmail, {}, {}))

//         if (isAlready?.isBlock == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))

//         const salt = await bcryptjs.genSaltSync(10)
//         const hashPassword = await bcryptjs.hash(body.password, salt)
//         delete body.password
//         body.password = hashPassword
//         body.userType = 1  //to specify this user is admin
//         let response = await new model(body).save()
//         response = {
//             userType: response?.userType,
//             isPhoneVerified: response?.isEmailVerified,
//             _id: response?._id,
//             email: response?.email,
//         }

//         while (otpFlag == 1) {
//             for (let flag = 0; flag < 1;) {
//                 otp = await Math.round(Math.random() * 1000000);
//                 if (otp.toString().length == 6) {
//                     flag++;
//                 }
//             }
//             let isAlreadyAssign = await model.findOne({ otp: otp });
//             if (isAlreadyAssign?.otp != otp) otpFlag = 0;
//         }

//         let result: any = await email_verification_mail(response, otp);
//         if (result) {
//             await model.findOneAndUpdate(body, { otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) })
//             return res.status(200).json(new apiResponse(200, `${result}`, {}, {}));
//         }
//         else return res.status(501).json(new apiResponse(501, responseMessage?.errorMail, {}, `${result}`));
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
//     }
// }

// export const adminLogin = async (req: Request, res: Response) => { //email or password // phone or password
//     let body = req.body,
//         response: any
//     reqInfo(req)
//     try {
//         response = await model.findOneAndUpdate({ email: body?.email, userType: 1, isActive: true }, { isLoggedIn : true }).select('-__v -createdAt -updatedAt')

//         if (!response) return res.status(400).json(new apiResponse(400, responseMessage?.invalidUserPasswordEmail, {}, {}))
//         if (response?.isBlock == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))

//         const passwordMatch = await bcryptjs.compare(body.password, response.password)
//         if (!passwordMatch) return res.status(400).json(new apiResponse(400, responseMessage?.invalidUserPasswordEmail, {}, {}))
//         const token = jwt.sign({
//             _id: response._id,
//             type: response.userType,
//             status: "Login",
//             generatedOn: (new Date().getTime())
//         }, jwt_token_secret)

//         await new userSessionModel({
//             createdBy: response._id,
//         }).save()
//         response = {
//             isEmailVerified: response?.isEmailVerified,
//             userType: response?.userType,
//             _id: response?._id,
//             email: response?.email,
//             token,
//         }
//         return res.status(200).json(new apiResponse(200, responseMessage?.loginSuccess, response, {}))

//     } catch (error) {
//         return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
//     }
// }



export const adminSignUp = async (req: Request, res: Response) => {
    reqInfo(req)
    try {
        let body = req.body,
            otp,
            otpFlag = 1; // OTP has already assign or not for cross-verification
        let isAlready = await adminModel.findOne({ email: body?.email, isActive: true })
        if (isAlready) return res.status(409).json(new apiResponse(409, responseMessage?.alreadyEmail, {}, {}))

        if (isAlready?.isBlock == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))

        const salt = await bcryptjs.genSaltSync(10)
        const hashPassword = await bcryptjs.hash(body.password, salt)
        delete body.password
        body.password = hashPassword
        let response = await new adminModel(body).save()
        response = {
            isEmailVerified: response?.isEmailVerified,
            _id: response?._id,
            email: response?.email,
        }

        while (otpFlag == 1) {
            for (let flag = 0; flag < 1;) {
                otp = await Math.round(Math.random() * 1000000);
                if (otp.toString().length == 6) {
                    flag++;
                }
            }
            let isAlreadyAssign = await adminModel.findOne({ otp: otp });
            if (isAlreadyAssign?.otp != otp) otpFlag = 0;
        }

        let result: any = await email_verification_mail(response, otp);
        if (result) {
            await adminModel.findOneAndUpdate(body, { otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) })
            return res.status(200).json(new apiResponse(200, `${result}`, {}, {}));
        }
        else return res.status(501).json(new apiResponse(501, responseMessage?.errorMail, {}, `${result}`));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const adminLogin = async (req: Request, res: Response) => { //email or password // phone or password
    let body = req.body,
        response: any
    reqInfo(req)
    try {
        response = await adminModel.findOneAndUpdate({ email: body?.email, isActive: true }, { isLoggedIn : true }).select('-__v -createdAt -updatedAt')

        if (!response) return res.status(400).json(new apiResponse(400, responseMessage?.invalidUserPasswordEmail, {}, {}))
        if (response?.isBlock == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))

        const passwordMatch = await bcryptjs.compare(body.password, response.password)
        if (!passwordMatch) return res.status(400).json(new apiResponse(400, responseMessage?.invalidUserPasswordEmail, {}, {}))
        const token = jwt.sign({
            _id: response._id,
            type: response.userType,
            status: "Login",
            generatedOn: (new Date().getTime())
        }, jwt_token_secret)

        await new userSessionModel({
            createdBy: response._id,
        }).save()
        response = {
            isEmailVerified: response?.isEmailVerified,
            _id: response?._id,
            email: response?.email,
            token,
        }
        return res.status(200).json(new apiResponse(200, responseMessage?.loginSuccess, response, {}))

    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const  admin_otp_verification = async (req: Request, res: Response) => {
    reqInfo(req)
    let body = req.body
    try {
        body.isActive = true
        let data = await adminModel.findOne(body);
        if (!data) return res.status(400).json(new apiResponse(400, responseMessage?.invalidOTP, {}, {}))
        if (data.isBlock == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))
        if (new Date(data.otpExpireTime).getTime() < new Date().getTime()) return res.status(410).json(new apiResponse(410, responseMessage?.expireOTP, {}, {}))
        if (data) {
            let response = await adminModel.findOneAndUpdate(body, { otp: null, otpExpireTime: null, isEmailVerified: true, isLoggedIn : true }, { new: true });
            const token = jwt.sign({
                _id: response._id,
                type: response.userType,
                status: "Login",
                generatedOn: (new Date().getTime())
            }, jwt_token_secret)

            await new userSessionModel({
                createdBy: response._id,
            }).save()

            let result = {
                isEmailVerified: response?.isEmailVerified,
                _id: response?._id,
                email: response?.email,
                token,
            }
            return res.status(200).json(new apiResponse(200, responseMessage?.OTPverified, result, {}))
        }

    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}