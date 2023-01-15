"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
// import { SMS_message } from '../common'
aws_sdk_1.default.config.update({
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.REGION
});
const sns = new aws_sdk_1.default.SNS({ apiVersion: '2010-03-31' });
const params = {
    attributes: { DefaultSMSType: 'Transactional', DefaultSenderID: 'fmm2022' },
};
const SNS_TOPIC_ARN = 'arn:aws:sns:ap-south-1:242611371821:fmm2022';
const sendSMS = (countryCode, number, SMS_template) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (countryCode && number) {
                number = `+${countryCode} ${number}`;
                yield sns.subscribe({
                    Protocol: 'SMS',
                    TopicArn: SNS_TOPIC_ARN,
                    Endpoint: number,
                }, function (error, data) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (error) {
                            console.log('Error in subscribe');
                            // console.log(error);
                        }
                        var params = {
                            Message: SMS_template,
                            PhoneNumber: number,
                            MessageAttributes: {
                                'AWS.SNS.SMS.SMSType': {
                                    DataType: 'String',
                                    StringValue: 'Transactional',
                                },
                                'AWS.SNS.SMS.SenderID': { DataType: 'String', StringValue: 'vPristine' }
                            }
                        };
                        // console.log('params:', params);
                        yield sns.publish(params, function (err_publish, data) {
                            if (err_publish) {
                                // console.log(err_publish);
                                reject(err_publish);
                            }
                            else {
                                // console.log(data);
                                resolve(data);
                            }
                        });
                    });
                });
            }
            else {
                resolve(true);
            }
        }
        catch (error) {
            // console.log(error)
            reject(error);
        }
    }));
});
exports.sendSMS = sendSMS;
//# sourceMappingURL=aws_sns.js.map