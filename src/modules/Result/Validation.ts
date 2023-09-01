const Joi = require('joi');
const { objectId } = require('../../utils/custom.validation');

const createQuiz = {
  body: Joi.object().keys({
    question: Joi.string().required(),
    options: Joi.array().required(),
    correctOption: Joi.number().required(),
    subject: Joi.string().custom(objectId),
  }),
};

const query = {
  query: Joi.object().keys({
    subject: Joi.string().custom(objectId).required(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getQuiz = {
  params: Joi.object().keys({
    subjectId: Joi.string().custom(objectId),
  }),
};

const answerSubmit = {
  body: Joi.object().keys({
    answers: Joi.array().items({
      id: Joi.string().custom(objectId).required(),
      answer: Joi.number().max(3).min(0),
    }),
  }),
};

module.exports = {
  createQuiz,
  query,
  getQuiz,
  answerSubmit,
};
