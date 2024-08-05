import express from 'express';
import subscriptionController from './Controller';
import { AsyncHandler } from '../../utils/AsyncHandler';
import auth from '../../middlewares/auth';
import { Validate } from '../../middlewares/validate';
import subscriptionValidation from './Validation';
const router = express.Router();

router
  .route('/')
  .post(
    auth('manageSubscription'),
    Validate(subscriptionValidation.create()),
    AsyncHandler(subscriptionController.create)
  )
  .get(
    auth(),
    Validate(subscriptionValidation.querySubscription()),
    AsyncHandler(subscriptionController.querySubscription)
  )
  .patch(
    auth('manageSubscription'),
    Validate(subscriptionValidation.upgradeSubscription()),
    AsyncHandler(subscriptionController.upgradeSubscription)
  )
  .delete(
    auth(),
    Validate(subscriptionValidation.upgradeSubscription()),
    AsyncHandler(subscriptionController.cancelSubscription)
  );

router.post(
  '/subscribe',
  auth('subscribe'),
  Validate(subscriptionValidation.subscribe()),
  AsyncHandler(subscriptionController.subscribe)
);
router.post(
  '/upgrade',
  auth('subscribe'),
  Validate(subscriptionValidation.upgradeSubscription()),
  AsyncHandler(subscriptionController.upgradeSubscription)
);

router.post(
  '/cancel',
  auth('subscribe'),
  // Validate(subscriptionValidation.upgradeSubscription()),
  AsyncHandler(subscriptionController.cancelSubscription)
);
router
  .route('/:id')
  .get(
    auth(),
    Validate(subscriptionValidation.getSubscription()),
    AsyncHandler(subscriptionController.getSubscription)
  )
  .patch(
    auth('manageSubscription'),
    Validate(subscriptionValidation.update()),
    AsyncHandler(subscriptionController.updateSubscription)
  )
  .delete(
    auth(),
    Validate(subscriptionValidation.getSubscription()),
    AsyncHandler(subscriptionController.deleteSubscription)
  );

router.post(
  '/webhook',
  AsyncHandler(subscriptionController.handleFailedPayments)
);

export { router as subscriptionRoutes };
