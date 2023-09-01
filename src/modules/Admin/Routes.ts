import express from "express";
import Controller from "./Controller";
import { AsyncHandler } from "../../utils/AsyncHandler";
import auth from "../../middlewares/auth";
import { Validate } from "../../middlewares/validate";
import Validation from "./Validation";
const router = express.Router();

router
  .route("/")
  .get(
    auth("manageAdmins"),
    Validate(Validation.queryAdmin()),
    AsyncHandler(Controller.queryAdmin)
  )
  .post(
    auth("manageAdmins"),
    Validate(Validation.register()),
    Controller.register
  );

router
  .route("/login")
  .post(Validate(Validation.login()), AsyncHandler(Controller.login));

router
  .route("/logout")
  .post(auth(), Validate(Validation.logout()), AsyncHandler(Controller.logout));

router
  .route("/:id")
  .get(
    auth(),
    Validate(Validation.getAdminById()),
    AsyncHandler(Controller.getAdminById)
  )
  .patch(
    auth(),
    Validate(Validation.updateAdmin()),
    AsyncHandler(Controller.updateAdmin)
  )
  .delete(
    auth("manageAdmins"),
    Validate(Validation.deleteAdmin()),
    AsyncHandler(Controller.deleteAdmin)
  );

// router
//   .route("/change/password")
//   .post(
//     auth(),
//     Validate(userValidation.changePassword()),
//     userController.changePassword
//   );

// router.post(
//   "/forgot/password",
//   Validate(userValidation.forgotPassword()),
//   userController.forgotPassword
// );

// router.post(
//   "/reset/password",
//   Validate(userValidation.resetPassword),
//   userController.resetPassword
// );
export { router as adminRoute };
