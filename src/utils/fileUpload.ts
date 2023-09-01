import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { BadRequestError } from '../errors/badRequest.error';
import { Logger } from '../config/logger';

const uploadPath = process.env.UPLOAD_PATH || 'public/uploads';
const storage = multer.diskStorage({
  destination: (req: Request, file, cb: Function) => {
    // if folder doesn't exuists creates it
    try {
      let [publicFolderPath, uploadFolderPath] = uploadPath.split('/');
      if (!existsSync(publicFolderPath)) {
        mkdirSync(publicFolderPath);
        mkdirSync(uploadPath);
      } else {
        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath);
        }
      }
      cb(null, uploadPath);
    } catch (error) {
      Logger.error(error);
      throw new Error('Something went wrong');
    }
  },
  filename: (req: Request, file, cb: Function) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

export const FileUpload = multer({
  storage,
  fileFilter: (req, file, cb: Function) => {
    if (
      !file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|mp4)$/)
    ) {
      cb(new BadRequestError('Only jpg and png files allowed'), false);
    }
    cb(null, true);
  },
});
