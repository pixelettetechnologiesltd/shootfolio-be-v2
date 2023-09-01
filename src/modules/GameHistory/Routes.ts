import express from "express";
import Controller from "./Controller";
import { AsyncHandler } from "../../utils/AsyncHandler";
import auth from "../../middlewares/auth";
import { Validate } from "../../middlewares/validate";
import Validation from "./Validation";
const router = express.Router();

router
  .route("/")
  .get(auth(), Validate(Validation.query()), AsyncHandler(Controller.query));

router
  .route("/:id")
  .get(auth(), Validate(Validation.get()), AsyncHandler(Controller.get));

export { router as gameHistoryRoutes };
