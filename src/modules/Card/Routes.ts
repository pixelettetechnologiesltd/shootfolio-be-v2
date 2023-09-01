import express from "express";
import cardontroller from "./Controller";
import { AsyncHandler } from "../../utils/AsyncHandler";
import auth from "../../middlewares/auth";
import { Validate } from "../../middlewares/validate";
import cardValidation from "./Validation";
const router = express.Router();

router
  .route("/")
  .post(
    auth(),
    Validate(cardValidation.create()),
    AsyncHandler(cardontroller.create)
  );
router
  .route("/logged/user")
  .get(auth(), AsyncHandler(cardontroller.getCardLoggedUser))
  .delete(auth(), AsyncHandler(cardontroller.deleteCard));

export { router as cardRoute };
