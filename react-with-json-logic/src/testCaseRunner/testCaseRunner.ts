import { Questionnaire, QuestionType, TestCase } from "../models/Questionnaire";
import { QuestionnaireEngine, Result } from "../logic/QuestionnaireEngine";
import equal from "fast-deep-equal/es6";

type TestResultSuccess = {
  description: string;
  success: true;
};

type TestResultError = {
  description: string;
  success: false;
  errorMessage: string;
};

export type TestResult = TestResultSuccess | TestResultError;

export function runTestCases(testQuestionnaire: Questionnaire): TestResult[] {
  if (testQuestionnaire.testCases === undefined || testQuestionnaire.testCases.length === 0) {
    return [];
  }

  return testQuestionnaire.testCases.map((testCase) => runOneTestCase(testQuestionnaire, testCase));
}

export function runOneTestCase(testQuestionnaire: Questionnaire, testCase: TestCase): TestResult {
  const timeOfExecution = testCase.fillInDate ? Date.parse(testCase.fillInDate) / 1000 : undefined;

  const engine = new QuestionnaireEngine(testQuestionnaire, timeOfExecution);

  const questionCheck = checkQuestions(engine, testCase);
  if (questionCheck) {
    return questionCheck;
  }

  const resultsCheck = checkResults(engine.getResults(), testCase);
  if (resultsCheck) {
    return resultsCheck;
  }

  return { description: testCase.description, success: true };
}

function checkQuestions(engine: QuestionnaireEngine, testCase: TestCase): TestResultError | undefined {
  const { description } = testCase;

  for (const [answerId, answerValue] of testCase.answers) {
    const question = engine.nextQuestion();
    if (question === undefined) {
      return { description, success: false, errorMessage: `Expected question with ID "${answerId}", but got none.` };
    }
    if (question.id !== answerId) {
      return {
        description,
        success: false,
        errorMessage: `Expected question with ID "${answerId}", but got question with ID ${question.id}.`,
      };
    }

    if (question.type !== QuestionType.Date) {
      engine.setAnswer(answerId, answerValue);
    } else {
      engine.setAnswer(answerId, Date.parse(answerValue) / 1000);
    }
  }

  const noMoreQuestions = engine.nextQuestion();
  if (noMoreQuestions !== undefined) {
    return {
      description,
      success: false,
      errorMessage: `Expected no more questions, but got question with ID ${noMoreQuestions.id}.`,
    };
  }

  return undefined;
}

function checkResults(results: Result[], testCase: TestCase): TestResultError | undefined {
  const mappedResults = results.map((it) => [it.resultCategory.id, it.result.id]);

  return equal(mappedResults, testCase.results)
    ? undefined
    : {
        description: testCase.description,
        success: false,
        errorMessage: `Expected results: ${JSON.stringify(testCase.results)}, but got results: ${JSON.stringify(
          mappedResults
        )}`,
      };
}
