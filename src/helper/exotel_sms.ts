import config from "config";
const fetch = require("node-fetch");

async function sendSMS(PhoneNumber: any) {
  const url = `https://api.exotel.in/v1/Accounts/${process.env.EXOTEL_SID}/Sms/send.json`;
  const body = {
    application_id: process.env.EXOTEL_APP_ID,
    phone_number: PhoneNumber,
  };
   const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(
        `${process.env.EXOTEL_SID}:${process.env.EXOTEL_TOKEN}`
      ).toString("base64")}`,
    },
    });
    const data = await response.json();
    return data;
}

async function verifyOtp(otp: any) {
  const url = `https://api.exotel.in/v1/Accounts/${process.env.EXOTEL_SID}/Sms/verify.json`;
   const body = {
    "otp": otp,
   }
    const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
        `${process.env.EXOTEL_SID}:${process.env.EXOTEL_TOKEN}`
        ).toString("base64")}`,
    },
    });
    const data = await response.json();
    return data;
    
}

export { sendSMS, verifyOtp };






















// "use strict"
// import config from 'config'
// import AWS from 'aws-sdk'
// // import { SMS_message } from '../common'

// AWS.config.update({
//     accessKeyId: process.env.AWS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.REGION
// })
// const sns = new AWS.SNS({ apiVersion: '2010-03-31' });
// const params = {
//     attributes: { DefaultSMSType: 'Transactional', DefaultSenderID: 'fmm2022' },
// }
// const SNS_TOPIC_ARN = 'arn:aws:sns:ap-south-1:242611371821:fmm2022';

// export const sendSMS = async (countryCode: any, number: any, SMS_template: any) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             if (countryCode && number) {
//                 number = `+${countryCode} ${number}`
//                 await sns.subscribe(
//                     {
//                         Protocol: 'SMS',
//                         TopicArn: SNS_TOPIC_ARN,
//                         Endpoint: number,
//                     },
//                     async function (error, data) {
//                         if (error) {
//                             console.log('Error in subscribe');
//                             // console.log(error);
//                         }
//                         var params = {
//                             Message: SMS_template,
//                             PhoneNumber: number,
//                             MessageAttributes: {
//                                 'AWS.SNS.SMS.SMSType': {
//                                     DataType: 'String',
//                                     StringValue: 'Transactional',
//                                 },
//                                 'AWS.SNS.SMS.SenderID': { DataType: 'String', StringValue: 'vPristine' }
//                             }
//                         };
//                         // console.log('params:', params);
//                         await sns.publish(params, function (err_publish, data) {
//                             if (err_publish) {
//                                 // console.log(err_publish);
//                                 reject(err_publish);
//                             } else {
//                                 // console.log(data);
//                                 resolve(data);
//                             }
//                         });
//                     }
//                 );
//             }
//             else {
//                 resolve(true)
//             }
//         } catch (error) {
//             // console.log(error)
//             reject(error)
//         }
//     });
// }

// // export const sendSMSTest = async (countryCode: any, number: any, SMS_template: any) => {
// //     return new Promise(async (resolve, reject) => {
// //         try {
// //             if (countryCode && number) {
// //                 number = `+${countryCode} ${number}`
// //                 var params = {
// //                     Message: SMS_template,
// //                     PhoneNumber: number,
// //                 };
// //                 var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
// //                 publishTextPromise.then(
// //                     function (data) {
// //                         console.log("MessageID is " + data.MessageId);
// //                     }).catch(
// //                         function (err) {
// //                             console.error(err, err.stack);
// //                         });
// //             }
// //             else {
// //                 resolve(true)
// //             }
// //         } catch (error) {
// //             console.log(error)
// //             reject(error)
// //         }
// //     });
// // }
