import AWS from 'aws-sdk';
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../errors/badRequest.error';
import config from '../config/config';

class FileUploadMiddleware {
  private s3: AWS.S3;
  private upload: multer.Multer;

  constructor() {
    AWS.config.update({
      accessKeyId: config.digitalOcean.access || 'DO00UZXY6G2BLJGEHFLV', // Default to empty string if undefined
      secretAccessKey:
        config.digitalOcean.secret ||
        'bpvjGAhkpIo3JnMTOGMOw784fOA//QojBv/sBb9+R0g', // Default to empty string if undefined
    });

    const endpoint =
      config.digitalOcean.endpoint || 'blr1.digitaloceanspaces.com';
    if (!endpoint) {
      throw new Error('SPACES_ENDPOINT environment variable is not defined.');
    }

    const spacesEndpoint = new AWS.Endpoint(endpoint); // DigitalOcean Spaces endpoint
    this.s3 = new AWS.S3({
      endpoint: spacesEndpoint,
    });

    this.upload = multer({
      storage: multer.memoryStorage(),
    });
  }

  uploadFile = (req: Request, res: Response, next: NextFunction) => {
    this.upload.single('photoPath')(req, res, (err: any) => {
      console.log('file===', req.file);
      console.log('error', err);
      if (err) {
        // const customError = new CustomError(
        //   'Image Error',
        //   'Error uploading file.',
        //   400
        // );
        // return handleError(res, customError);
        throw new BadRequestError('Error uploading file.');
      }

      if (!req.file) {
        return next();
      }

      const bucket = config.digitalOcean.spaceName;
      if (!bucket) {
        throw new Error('SPACES_BUCKET environment variable is not defined.');
      }

      const params = {
        Bucket: bucket,
        Key: req.file.originalname,
        Body: req.file.buffer,
        ACL: 'public-read',
      };

      this.s3.upload(params, (s3Err: any, data: any) => {
        if (s3Err) {
          console.error(s3Err);
          //   const customError = new CustomError(
          //     'Image Error',
          //     'Error uploading file to S3.',
          //     500
          //   );
          throw new BadRequestError('Error uploading file to S3.');
        }

        res.locals.s3Data = data;

        next();
      });
    });
  };

  uploadFiles = (req: Request, res: Response, next: NextFunction) => {
    this.upload.array('files', 10)(req, res, (err: any) => {
      if (err) {
        // const customError = new CustomError(
        //   'Image Error',
        //   'Error uploading files.',
        //   400
        // );
        // return handleError(res, customError);
        throw new BadRequestError('Error uploading file to S3.');
      }

      if (!req.files || req.files.length === 0) {
        return next();
      }

      const bucket = config.digitalOcean.spaceName || 'sapaid-store';
      if (!bucket) {
        throw new Error('SPACES_BUCKET environment variable is not defined.');
      }

      const uploadPromises = (req.files as Express.Multer.File[]).map(
        (file: Express.Multer.File) => {
          const params = {
            Bucket: bucket,
            Key: file.originalname,
            Body: file.buffer,
            ACL: 'public-read',
          };

          return new Promise((resolve, reject) => {
            this.s3.upload(params, (s3Err: any, data: any) => {
              if (s3Err) {
                console.error(s3Err);
                // const customError = new CustomError(
                //   'Image Error',
                //   'Error uploading file to S3.',
                //   500
                // );
                const customError = new BadRequestError(
                  'Error uploading file to S3.'
                );
                reject(customError);
              } else {
                resolve(data);
              }
            });
          });
        }
      );

      Promise.all(uploadPromises)
        .then((uploadedData) => {
          res.locals.space = uploadedData;
          next();
        })
        .catch((error) => {
          throw new BadRequestError(`${error}`);
        });
    });
  };
}

export default new FileUploadMiddleware();
