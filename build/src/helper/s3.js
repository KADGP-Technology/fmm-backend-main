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
exports.upload_invoice_pdf = exports.upload_csv_file = exports.upload_all_type = exports.delete_file = exports.image_compress_response = exports.file_upload_response = exports.uploadS3_contributor = exports.uploadS3_icon_theme = exports.compress_image = exports.uploadS3 = exports.deleteImage = void 0;
require('dotenv').config();
const multer_1 = __importDefault(require("multer"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const winston_logger_1 = require("./winston_logger");
const multer_s3_1 = __importDefault(require("multer-s3"));
const common_1 = require("../common");
const multer_s3_transform_1 = __importDefault(require("multer-s3-transform"));
const sharp_1 = __importDefault(require("sharp"));
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.REGION
});
const bucket_name = process.env.BUCKET_NAME;
const bucket_url = process.env.BUCKET_URL;
const deleteImage = function (file, folder) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const bucketPath = `${bucket_name}/${folder}`;
                    let params = {
                        Bucket: bucketPath,
                        Key: file
                    };
                    yield s3.deleteObject(params, function (err, data) {
                        if (err) {
                            console.log(err);
                            reject(err);
                        }
                        else {
                            winston_logger_1.logger.info("File successfully delete");
                            resolve("File successfully delete");
                        }
                    });
                }
                catch (error) {
                    console.log(error);
                    reject(false);
                }
            });
        });
    });
};
exports.deleteImage = deleteImage;
exports.uploadS3 = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: bucket_name,
        acl: 'public-read',
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            var _a, _b;
            winston_logger_1.logger.info('file successfully upload');
            const file_type = file.originalname.split('.');
            req.body.location = `${bucket_url}/${(_a = req.header('user')) === null || _a === void 0 ? void 0 : _a._id}/${req.params.file}/${Date.now().toString()}.${file_type[file_type.length - 1]}`;
            cb(null, `${(_b = req.header('user')) === null || _b === void 0 ? void 0 : _b._id}/${req.params.file}/${Date.now().toString()}.${file_type[file_type.length - 1]}`);
        },
    }),
});
exports.compress_image = (0, multer_1.default)({
    storage: (0, multer_s3_transform_1.default)({
        s3: s3,
        bucket: bucket_name,
        acl: 'public-read',
        shouldTransform: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        transforms: [{
                id: 'image_500_300',
                key: function (req, file, cb) {
                    var _a, _b;
                    const file_type = file.originalname.split('.');
                    req.body.location = `${bucket_url}/${(_a = req.header('user')) === null || _a === void 0 ? void 0 : _a._id}/${req.params.file}/${Date.now().toString()}.${file_type[file_type.length - 1]}`;
                    cb(null, `${(_b = req.header('user')) === null || _b === void 0 ? void 0 : _b._id}/${req.params.file}/${Date.now().toString()}.${file_type[file_type.length - 1]}`);
                },
                transform: function (req, file, cb) {
                    winston_logger_1.logger.info('compress image successfully upload');
                    cb(null, (0, sharp_1.default)().withMetadata().jpeg({ quality: 50 }));
                }
            }]
    })
});
exports.uploadS3_icon_theme = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: bucket_name,
        acl: 'public-read',
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            winston_logger_1.logger.info('file successfully upload');
            const file_type = file.originalname.split('.');
            req.body.location = `${bucket_url}/${req.params.file}/${Date.now().toString()}.${file_type[file_type.length - 1]}`;
            cb(null, `${req.params.file}/${Date.now().toString()}.${file_type[file_type.length - 1]}`);
        },
    }),
});
exports.uploadS3_contributor = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: bucket_name,
        acl: 'public-read',
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            winston_logger_1.logger.info('file successfully upload');
            const file_type = file.originalname.split('.');
            req.body.location = `${bucket_url}/${req.params.file}/${Date.now().toString()}.${file_type[file_type.length - 1]}`;
            cb(null, `${req.params.file}/${Date.now().toString()}.${file_type[file_type.length - 1]}`);
        },
    }),
});
const file_upload_response = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, winston_logger_1.reqInfo)(req);
    try {
        let file = req.file;
        return res.status(200).json({
            status: 200,
            message: "Image successfully uploaded",
            // data: { image: file?.location }
            data: { image: req.body.location }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, 'Internal server error in reset-password', {}, error));
    }
});
exports.file_upload_response = file_upload_response;
const image_compress_response = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, winston_logger_1.reqInfo)(req);
    try {
        let file = req.file;
        return res.status(200).json({
            status: 200,
            message: "Image successfully uploaded",
            // data: { image: file?.transforms[0]?.location }
            data: { image: req.body.location }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, 'Internal Server Error', {}, error));
    }
});
exports.image_compress_response = image_compress_response;
const delete_file = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, winston_logger_1.reqInfo)(req);
    let { file, folder } = req.params;
    try {
        let message = yield (0, exports.deleteImage)(file, folder);
        return res.status(200).json(new common_1.apiResponse(200, `${message}`, {}, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, 'Internal Server Error ', {}, error));
    }
});
exports.delete_file = delete_file;
const upload_all_type = function (image, bucketPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // image.data = await compressImage(image)
                    var params = {
                        Bucket: `${bucket_name}/${bucketPath}`,
                        Key: image.name,
                        Body: image.data,
                        ContentType: image.mimetype,
                        ACL: "public-read"
                    };
                    winston_logger_1.logger.debug("Uploading S3");
                    s3.upload(params, function (err, data) {
                        if (err) {
                            console.log(err);
                            reject();
                        }
                        else {
                            winston_logger_1.logger.debug("Successfully uploaded data ");
                            resolve(data.Location);
                        }
                    });
                }
                catch (error) {
                    console.log(error);
                    reject();
                }
            });
        });
    });
};
exports.upload_all_type = upload_all_type;
const upload_csv_file = (csvData) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(function (resolve, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = {
                    Bucket: bucket_name,
                    Key: `${Date.now()}-inventory-data.csv`,
                    ACL: 'public-read',
                    Body: csvData,
                    ContentType: 'text/csv',
                };
                s3.upload(params, (s3Err, data) => __awaiter(this, void 0, void 0, function* () {
                    if (s3Err) {
                        console.log(s3Err);
                        reject();
                    }
                    winston_logger_1.logger.debug("Successfully uploaded data ");
                    resolve(data.Location);
                }));
            }
            catch (error) {
                console.log(error);
                reject();
            }
        });
    });
});
exports.upload_csv_file = upload_csv_file;
const upload_invoice_pdf = (fileContent, invoice) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(function (resolve, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var params = {
                    Key: `${Date.now()}-invoice`,
                    Body: fileContent,
                    Bucket: bucket_name,
                    ContentType: 'application/pdf',
                    ACL: "public-read",
                    contentDisposition: 'attachment',
                    ServerSideEncryption: 'AES256'
                };
                s3.upload(params, function (err, res) {
                    if (err) {
                        console.log(err, 'err');
                        reject(err);
                    }
                    console.log(res, 'res');
                    resolve(res.Location);
                });
            }
            catch (error) {
                console.log(error);
                reject();
            }
        });
    });
});
exports.upload_invoice_pdf = upload_invoice_pdf;
//# sourceMappingURL=s3.js.map