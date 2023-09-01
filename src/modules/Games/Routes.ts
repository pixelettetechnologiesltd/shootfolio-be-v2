import express from "express";
import Controller from "./Controller";
import { AsyncHandler } from "../../utils/AsyncHandler";
import auth from "../../middlewares/auth";
import { Validate } from "../../middlewares/validate";
import Validation from "./Validation";
import { shoot } from "./api/shoot";
const router = express.Router();

router
  .route("/")
  .post(auth(), Validate(Validation.create()), AsyncHandler(Controller.create))
  .get(auth(), Validate(Validation.query()), AsyncHandler(Controller.query));

router
  .route("/:id")
  .get(auth(), Validate(Validation.get()), AsyncHandler(Controller.get))
  .patch(auth(), Validate(Validation.update()), AsyncHandler(Controller.update))
  .delete(
    auth(),
    Validate(Validation.delete()),
    AsyncHandler(Controller.delete)
  );

router.get(
  "/user/history",
  auth(),
  // Validate(Validation.query()),
  AsyncHandler(Controller.getHistory)
);
router.post(
  "/sell",
  auth(),
  Validate(Validation.sell()),
  AsyncHandler(Controller.sell)
);

router.post(
  "/buy",
  auth(),
  Validate(Validation.sell()),
  AsyncHandler(Controller.buy)
);
router.post(
  "/change/coin",
  auth(),
  Validate(Validation.changeCoin()),
  AsyncHandler(Controller.changeCoin)
);

router.post(
  "/borrow/money",
  auth(),
  Validate(Validation.borrowMoney()),
  AsyncHandler(Controller.borrowMoney)
);

router.post(
  "/pass/ball",
  auth(),
  Validate(Validation.passBall()),
  AsyncHandler(Controller.passBall)
);

router.post(
  "/tackle/opponent",
  auth(),
  Validate(Validation.tackle()),
  AsyncHandler(Controller.tackle)
);
router.post(
  "/shoot/opponent",
  auth(),
  Validate(Validation.tackle()),
  AsyncHandler(Controller.shootBall)
);

export { router as gamesRoutes };
