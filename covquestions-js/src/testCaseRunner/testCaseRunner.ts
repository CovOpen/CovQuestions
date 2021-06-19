import { QuestionnaireEngine, RawAnswer } from "../questionnaireEngine";
import { Questionnaire, TestCase } from "../models/Questionnaire.generated";
import { createRandomAnswer } from "./createRandomAnswer";
import { checkResults } from "./checkResults";
import { checkVariables } from "./checkVariables";

type TestResultSuccess = {
  description: string;
  success: true;
};

export type TestResultError = {
  description: string;
  success: false;
  errorMessage: string;
  answers?: { questionId: string; rawAnswer: RawAnswer }[];
};

export type TestResult = TestResultSuccess | TestResultError;

export function runTestCases(testQuestionnaire: Questionnaire): TestResult[] {
  if (testQuestionnaire.testCases === undefined || testQuestionnaire.testCases.length === 0) {
    return [];
  }

  return testQuestionnaire.testCases.map((testCase) => runOneTestCase(testQuestionnaire, testCase));
}

export function runOneTestCase(testQuestionnaire: Questionnaire, testCase: TestCase): TestResult {
  const timeOfExecution =
    testCase.options !== undefined && testCase.options.fillInDate !== undefined
      ? dateInSecondsTimestamp(testCase.options.fillInDate)
      : Date.now() / 1000;

  if (isRandomTestCase(testCase)) {
    return runOneTestCaseRandomly(testQuestionnaire, testCase, timeOfExecution);
  }

  return runOneTestCaseOnce(testQuestionnaire, testCase, timeOfExecution);
}

function runOneTestCaseRandomly(
  testQuestionnaire: Questionnaire,
  testCase: TestCase,
  timeOfExecution: number | undefined
): TestResult {
  const results = [];
  const randomRuns =
    testCase.options !== undefined && testCase.options.randomRuns !== undefined ? testCase.options.randomRuns : 1;
  for (let i = 0; i < randomRuns; i++) {
    const result = runOneTestCaseOnce(testQuestionnaire, testCase, timeOfExecution);
    results.push(result);
  }

  if (results.every((result) => result.success === true)) {
    return { success: true, description: testCase.description };
  } else {
    const numberOfFailures = results.filter((result) => result.success === false).length;
    const firstFailure = results.find((result) => result.success === false) as TestResultError;
    return {
      success: false,
      description: testCase.description,
      errorMessage: `Failed ${numberOfFailures} out of ${randomRuns} times. First failure: ${firstFailure.errorMessage}`,
      answers: firstFailure.answers,
    };
  }
}

function runOneTestCaseOnce(
  testQuestionnaire: Questionnaire,
  testCase: TestCase,
  timeOfExecution: number | undefined
): TestResult {
  const engine = new QuestionnaireEngine(testQuestionnaire, timeOfExecution);

  const answerQuestionsError = answerQuestions(engine, testCase);
  if (answerQuestionsError) {
    return {
      ...answerQuestionsError,
      answers: engine.getAnswersPersistence().answers,
    };
  }

  const resultsCheckError = checkResults(engine.getCategoryResults(), testCase);
  if (resultsCheckError) {
    return {
      ...resultsCheckError,
      answers: engine.getAnswersPersistence().answers,
    };
  }

  const variableCheckError = checkVariables(engine.getVariables(), testCase);
  if (variableCheckError) {
    return {
      ...variableCheckError,
      answers: engine.getAnswersPersistence().answers,
    };
  }

  return { description: testCase.description, success: true };
}

function isRandomTestCase(testCase: TestCase) {
  return (
    (testCase.options !== undefined && testCase.options.randomRuns !== undefined ? testCase.options.randomRuns : 0) > 0
  );
}

function answerQuestions(engine: QuestionnaireEngine, testCase: TestCase): TestResultError | undefined {
  const { description } = testCase;

  let question = engine.nextQuestion();

  while (question !== undefined) {
    const answerValue = testCase.answers[question.id];

    if (answerValue !== undefined) {
      // answer was provided in test case
      if (question.type !== "date") {
        engine.setAnswer(question.id, answerValue);
      } else {
        engine.setAnswer(question.id, dateInSecondsTimestamp(answerValue as string));
      }
    } else {
      // answer was not provided in test case
      if (isRandomTestCase(testCase)) {
        const randomAnswer = createRandomAnswer(question, testCase);
        engine.setAnswer(question.id, randomAnswer);
      } else if (question.optional) {
        engine.setAnswer(question.id, undefined);
      } else {
        return {
          description,
          success: false,
          errorMessage: `No answer for question with ID "${question.id}" was provided, while questionMode is not random and the question is not optional.`,
        };
      }
    }

    question = engine.nextQuestion();
  }
  return undefined;
}

//TODO: https://github.com/CovOpen/CovQuestions/issues/124
export function dateInSecondsTimestamp(date: string | number) {
  if (typeof date === "number") {
    return date;
  }
  return Math.round(Date.parse(date) / 1000);
}
