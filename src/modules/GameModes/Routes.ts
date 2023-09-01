import express from "express";
import Controller from "./Controller";
import { AsyncHandler } from "../../utils/AsyncHandler";
import auth from "../../middlewares/auth";
import { Validate } from "../../middlewares/validate";
import Validation from "./Validation";
const router = express.Router();

router
  .route("/")
  .post(
    auth("manageGameModes"),
    Validate(Validation.create()),
    AsyncHandler(Controller.create)
  )
  .get(auth(), Validate(Validation.query()), AsyncHandler(Controller.query));

router
  .route("/:id")
  .get(auth(), Validate(Validation.get()), AsyncHandler(Controller.get))
  .patch(
    auth("manageGameModes"),
    Validate(Validation.update()),
    AsyncHandler(Controller.update)
  )
  .delete(
    auth("manageGameModes"),
    Validate(Validation.delete()),
    AsyncHandler(Controller.delete)
  );

export { router as gameModeRoutes };
