"use strict";
const express = require('express');
const controller = require('./controller');
const validation = require('./validation');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const router = express.Router();
router
    .route('/')
    .post(auth('manageQuizzes'), validate(validation.createQuiz), controller.createQuiz)
    .get(auth(), validate(validation.query), controller.queryQuizzes);
router
    .route('/:subjectId')
    .post(auth(), validate(validation.answerSubmit), controller.answerSubmit);
// .get(auth(), validate(validation.query), controller.queryQuizzes);
module.exports = {
    quizRoutes: router,
};
