import express from 'express';
import Controller from './Controller';
import { AsyncHandler } from '../../utils/AsyncHandler';
import auth from '../../middlewares/auth';
import { Validate } from '../../middlewares/validate';
import Validation from './Validation';
import { FileUpload } from '../../utils/fileUpload';

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageQuiz'),
    Validate(Validation.create()),
    AsyncHandler(Controller.create)
  )
  .get(auth(), Validate(Validation.query()), AsyncHandler(Controller.query));

router
  .route('/answerSubmit')
  .post(
    auth(),
    Validate(Validation.answerSubmit()),
    AsyncHandler(Controller.answerSubmit)
  );

router.route('/random').get(auth(), AsyncHandler(Controller.randomQuestion));
router
  .route('/uploadcsv')
  .post(
    auth('manageQuiz'),
    FileUpload.single('csvFile'),
    AsyncHandler(Controller.uploadQuestions)
  );

// .patch(auth(), Validate(Validation.update()), AsyncHandler(Controller.update))
// .delete(
//   auth(),
//   Validate(Validation.delete()),
//   AsyncHandler(Controller.delete)
// );

export { router as quizRoutes };
