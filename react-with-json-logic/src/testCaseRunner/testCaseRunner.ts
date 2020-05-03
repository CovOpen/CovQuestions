import { QuestionnaireEngine, Result } from "covquestions-js";
import { Questionnaire, TestCase } from "covquestions-js/models/Questionnaire.generated";
import { dateInSecondsTimestamp } from "../utils/date";

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
  const timeOfExecution = testCase.options?.fillInDate
    ? dateInSecondsTimestamp(testCase.options?.fillInDate)
    : undefined;

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

function findUnusedElements(arrayWithPossibleUnusedElements: string[], subSetOfFirstArray: string[]): string[] {
  if (subSetOfFirstArray.length !== arrayWithPossibleUnusedElements.length) {
    return arrayWithPossibleUnusedElements.filter((it) => !subSetOfFirstArray.includes(it));
  }

  return [];
}

function checkQuestions(engine: QuestionnaireEngine, testCase: TestCase): TestResultError | undefined {
  const { description } = testCase;
  const questionMode = testCase.options?.questionMode;

  const givenAnswers: string[] = [];

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
      givenAnswers.push(question.id);
    } else {
      // answer was not provided in test case
      if (!question.isOptional()) {
        return {
          description,
          success: false,
          errorMessage: `No answer for question with ID "${question.id}" was provided, while questionMode is not random and the question is not optional.`,
        };
      }
      engine.setAnswer(question.id, undefined);
    }

    question = engine.nextQuestion();
  }

  const unusedAnswers = findUnusedElements(Object.keys(testCase.answers), givenAnswers);
  if (questionMode === "strict" && unusedAnswers.length > 0) {
    return {
      description,
      success: false,
      errorMessage: `Not all provided answer were needed to fill the questionnaire: ${JSON.stringify(unusedAnswers)}`,
    };
  }

  return undefined;
}

function checkResults(executionResults: Result[], testCase: TestCase): TestResultError | undefined {
  const { description } = testCase;
  const resultsMode = testCase.options?.resultsMode;

  const executionResultStrings = executionResults.map((it) => it.resultCategory.id + ": " + it.result.id);
  const testCaseResultStrings = Object.entries(testCase.results).map(
    ([categoryId, resultId]) => categoryId + ": " + resultId
  );

  const allResultsInTestCaseAreValid = testCaseResultStrings.every((testCaseResultString) =>
    executionResultStrings.includes(testCaseResultString)
  );

  if (!allResultsInTestCaseAreValid) {
    return {
      description,
      success: false,
      errorMessage: `Wrong results "${executionResultStrings}" vs "${testCaseResultStrings}"`,
    };
  }

  if (resultsMode !== "strict") {
    return undefined;
  }

  const notSpecifiedResults = findUnusedElements(executionResultStrings, testCaseResultStrings);

  if (notSpecifiedResults.length > 0) {
    return {
      description,
      success: false,
      errorMessage: `The execution provided additional results in strict mode: "${notSpecifiedResults}"`,
    };
  }
  return undefined;
}
