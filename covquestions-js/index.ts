/**
 * @module myLibrary
 */

export { QuestionnaireEngine, Result, RawAnswer } from "./src/questionnaireEngine";

export {
  Questionnaire,
  Question,
  QuestionWithOptions,
  QuestionWithoutOptions,
  LogicExpression,
  ISOLanguage,
  TestCase,
} from "./src/models/Questionnaire.generated";

export { isQuestionWithOptions, isQuestionWithoutOptions, isNumericQuestion } from "./src/models/typeguards";

export { isPrimitive, Primitive } from "./src/primitive";

export { runOneTestCase, runTestCases, TestResult } from "./src/testCaseRunner/testCaseRunner";
