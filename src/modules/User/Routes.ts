import express from 'express';
import userController from './Controller';
import { AsyncHandler } from '../../utils/AsyncHandler';
import auth from '../../middlewares/auth';
import { Validate } from '../../middlewares/validate';
import userValidation from './Validation';
import { FileUpload } from '../../utils/fileUpload';
const router = express.Router();

router
  .route('/')
  .get(
    auth(),
    Validate(userValidation.queryUsers()),
    userController.queryUsers
  );
router
  .route('/register')
  .post(
    Validate(userValidation.register()),
    AsyncHandler(userController.register)
  );

router
  .route('/login')
  .post(Validate(userValidation.login()), AsyncHandler(userController.login));

router
  .route('/logout')
  .post(
    auth(),
    Validate(userValidation.logout()),
    AsyncHandler(userController.logout)
  );

router
  .route('/:id')
  .get(
    auth(),
    Validate(userValidation.getUserById()),
    userController.getUserById
  )
  .patch(
    auth(),
    FileUpload.single('photoPath'),
    Validate(userValidation.updateUser()),
    userController.updateUser
  )
  .delete(
    auth('manageUsers'),
    Validate(userValidation.deleteUser()),
    userController.deleteUser
  );

router
  .route('/device/token')
  .post(
    auth(),
    Validate(userValidation.addDeviceToken()),
    userController.addDeviceToken
  );

router
  .route('/change/password')
  .post(
    auth(),
    Validate(userValidation.changePassword()),
    userController.changePassword
  );

router
  .route('/status/:id')
  .patch(
    auth('manageUsers'),
    Validate(userValidation.updateUserStatus()),
    userController.updateStatus
  );

router.post(
  '/forgot/password',
  Validate(userValidation.forgotPassword()),
  userController.forgotPassword
);

router.post(
  '/reset/password',
  Validate(userValidation.resetPassword),
  userController.resetPassword
);

router
  .route('/updateUser/:id')
  .patch(
    auth('manageUsers'),
    Validate(userValidation.updateUserByAdmin),
    userController.updateUserByAdmin
  );

router.route('/verify/:token').get(
  // auth(),
  Validate(userValidation.verifyToken),
  AsyncHandler(userController.verifyEmail)
);

router
  .route('/social')
  .post(
    Validate(userValidation.socialLogin()),
    AsyncHandler(userController.socialLogin)
  );

router
  .route('/update/subscription/:id')
  .patch(
    auth('manageUsers'),
    Validate(userValidation.updateSubscription()),
    AsyncHandler(userController.updateSubscription)
  );

router.get(
  '/statistics',
  auth(),
  AsyncHandler(userController.getUserStatistics)
);
export { router as userRoute };
