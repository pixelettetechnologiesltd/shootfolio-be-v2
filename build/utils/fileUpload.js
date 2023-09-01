"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const badRequest_error_1 = require("../errors/badRequest.error");
const logger_1 = require("../config/logger");
const uploadPath = process.env.UPLOAD_PATH || 'public/uploads';
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // if folder doesn't exuists creates it
        try {
            let [publicFolderPath, uploadFolderPath] = uploadPath.split('/');
            if (!(0, fs_1.existsSync)(publicFolderPath)) {
                (0, fs_1.mkdirSync)(publicFolderPath);
                (0, fs_1.mkdirSync)(uploadPath);
            }
            else {
                if (!(0, fs_1.existsSync)(uploadPath)) {
                    (0, fs_1.mkdirSync)(uploadPath);
                }
            }
            cb(null, uploadPath);
        }
        catch (error) {
            logger_1.Logger.error(error);
            throw new Error('Something went wrong');
        }
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path_1.default.extname(file.originalname));
    },
});
exports.FileUpload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|mp4)$/)) {
            cb(new badRequest_error_1.BadRequestError('Only jpg and png files allowed'), false);
        }
        cb(null, true);
    },
});
