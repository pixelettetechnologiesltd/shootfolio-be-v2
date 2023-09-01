import express from "express";
import gameModeController from "./Controller";
import { AsyncHandler } from "../../utils/AsyncHandler";
import auth from "../../middlewares/auth";
import { Validate } from "../../middlewares/validate";
import gameModeValidation from "./Validation";
const router = express.Router();

router
  .route("/register")
  .post(
    Validate(gameModeValidation.create()),
    AsyncHandler(gameModeController.create)
  );

  export { router as gameModeRoute };