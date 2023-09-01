import express from "express";
import Controller from "./Controller";
import { AsyncHandler } from "../../utils/AsyncHandler";
import auth from "../../middlewares/auth";
import { Validate } from "../../middlewares/validate";
import Validation from "./Validation";
import { FileUpload } from "../../utils/fileUpload";
const router = express.Router();

router
  .route("/")
  .post(
    auth("manageGameTypes"),
    FileUpload.single("photoPath"),
    Validate(Validation.create()),
    AsyncHandler(Controller.create)
  )
  .get(auth(), Validate(Validation.query()), AsyncHandler(Controller.query));

router
  .route("/:id")
  .get(auth(), Validate(Validation.get()), AsyncHandler(Controller.get))
  .patch(
    auth("manageGameTypes"),
    FileUpload.single("photoPath"),
    Validate(Validation.update()),
    AsyncHandler(Controller.update)
  )
  .delete(
    auth("manageGameTypes"),
    Validate(Validation.delete()),
    AsyncHandler(Controller.delete)
  );

router.get("/compete/clubs", auth(), AsyncHandler(Controller.getCompeteCLubs));

export { router as gameClubRoute };
