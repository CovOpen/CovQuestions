import { Question, QuestionnaireEngine, Result } from "../questionnaireEngine";
import {
  Option,
  Questionnaire,
  TestCase,
} from "../models/Questionnaire.generated";

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
  if (
    testQuestionnaire.testCases === undefined ||
    testQuestionnaire.testCases.length === 0
  ) {
    return [];
  }

  return testQuestionnaire.testCases.map((testCase) =>
    runOneTestCase(testQuestionnaire, testCase)
  );
}

export function runOneTestCase(
  testQuestionnaire: Questionnaire,
  testCase: TestCase
): TestResult {
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
    testCase.options !== undefined && testCase.options.randomRuns !== undefined
      ? testCase.options.randomRuns
      : 1;
  for (let i = 0; i < randomRuns; i++) {
    const result = runOneTestCaseOnce(
      testQuestionnaire,
      testCase,
      timeOfExecution
    );
    results.push(result);
  }
  if (results.every((result) => result.success === true)) {
    return { success: true, description: testCase.description };
  } else {
    const numberOfFailures = results.filter(
      (result) => result.success === false
    ).length;
    const firstFailure = results.find(
      (result) => result.success === false
    ) as TestResultError;
    return {
      success: false,
      description: testCase.description,
      errorMessage: `Failed ${numberOfFailures} out of ${randomRuns} times. First failure: ${firstFailure.errorMessage}`,
    };
  }
}

function runOneTestCaseOnce(
  testQuestionnaire: Questionnaire,
  testCase: TestCase,
  timeOfExecution: number | undefined
): TestResult {
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

function findUnusedElements(
  arrayWithPossibleUnusedElements: string[],
  subSetOfFirstArray: string[]
): string[] {
  if (subSetOfFirstArray.length !== arrayWithPossibleUnusedElements.length) {
    return arrayWithPossibleUnusedElements.filter(
      (it) => !subSetOfFirstArray.includes(it)
    );
  }

  return [];
}

function isRandomTestCase(testCase: TestCase) {
  return (
    (testCase.options !== undefined && testCase.options.randomRuns !== undefined
      ? testCase.options.randomRuns
      : 0) > 0
  );
}

function checkQuestions(
  engine: QuestionnaireEngine,
  testCase: TestCase
): TestResultError | undefined {
  const { description } = testCase;

  let question = engine.nextQuestion();

  while (question !== undefined) {
    const answerValue = testCase.answers[question.id];

    if (answerValue !== undefined) {
      // answer was provided in test case
      if (question.type !== "date") {
        engine.setAnswer(question.id, answerValue);
      } else {
        engine.setAnswer(
          question.id,
          dateInSecondsTimestamp(answerValue as string)
        );
      }
    } else {
      // answer was not provided in test case
      if (isRandomTestCase(testCase)) {
        const randomAnswer = createRandomAnswer(question, testCase);
        engine.setAnswer(question.id, randomAnswer);
      } else if (question.isOptional()) {
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

function createRandomAnswer(question: Question, testCase: TestCase) {
  const percentageOfOptionalQuestionsThatAreNotAnswered = 0.2;
  if (
    question.isOptional() &&
    Math.random() < percentageOfOptionalQuestionsThatAreNotAnswered
  ) {
    return undefined;
  }

  switch (question.type) {
    case "select":
      return getRandomElementFromArray(question.options!).value;
    case "multiselect":
      return getRandomOptionValues(question.options!);
    case "date":
      return getRandomDate(
        testCase.options !== undefined ? testCase.options.fillInDate : undefined
      );
    case "boolean":
      return Math.random() < 0.5;
    case "number":
      return getRandomInRange(
        question.numericOption !== undefined &&
          question.numericOption.min !== undefined
          ? question.numericOption.min
          : 0,
        question.numericOption !== undefined &&
          question.numericOption.max !== undefined
          ? question.numericOption.max
          : 150,
        question.numericOption !== undefined &&
          question.numericOption.step !== undefined
          ? question.numericOption.step
          : 1
      );
    case "text":
      return Math.random().toString(36).substring(2);
  }
}

function getRandomElementFromArray(array: any[]): any {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomOptionValues(options: Option[]) {
  return options.reduce(
    (selectedValues: string[], option) =>
      Math.random() < 0.5 ? [...selectedValues, option.value] : selectedValues,
    []
  );
}

function getRandomDate(fillInDate?: string) {
  const executionDate =
    fillInDate !== undefined
      ? dateInSecondsTimestamp(fillInDate)
      : Date.now() / 1000;
  const daysBeforeOrAfterExecution = getRandomInRange(-30, 30);
  return Math.round(executionDate + daysBeforeOrAfterExecution * 24 * 3600);
}

function getRandomInRange(min: number, max: number, step: number = 1) {
  const numberInRange = Math.random() * (max - min) + min;
  return Math.round(numberInRange / step) * step;
}

function checkResults(
  executionResults: Result[],
  testCase: TestCase
): TestResultError | undefined {
  const { description } = testCase;

  const executionResultStrings = executionResults.map(
    (it) => it.resultCategory.id + ": " + it.result.id
  );
  const testCaseResultStrings = Object.entries(testCase.results).map(
    ([categoryId, resultId]) => categoryId + ": " + resultId
  );

  const allResultsInTestCaseAreValid = testCaseResultStrings.every(
    (testCaseResultString) =>
      executionResultStrings.includes(testCaseResultString)
  );

  if (!allResultsInTestCaseAreValid) {
    return {
      description,
      success: false,
      errorMessage: `Wrong results: expected "${testCaseResultStrings}", but the questionnaire resulted in "${executionResultStrings}"`,
    };
  }

  if (testCase.options === undefined || !testCase.options.strictResults) {
    return undefined;
  }

  const notSpecifiedResults = findUnusedElements(
    executionResultStrings,
    testCaseResultStrings
  );

  if (notSpecifiedResults.length > 0) {
    return {
      description,
      success: false,
      errorMessage: `The execution provided additional results in strict mode: "${notSpecifiedResults}"`,
    };
  }
  return undefined;
}

function dateInSecondsTimestamp(dateString: string) {
  return Math.round(Date.parse(dateString) / 1000);
}
