import equal from "fast-deep-equal/es6";
import { Questionnaire, QuestionType, TestCase } from "covquestions-js/models/questionnaire";
import { QuestionnaireEngine, Result } from "covquestions-js";

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
  const timeOfExecution = testCase.options?.fillInDate ? Date.parse(testCase.options?.fillInDate) / 1000 : undefined;

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

function findUnusedProvidedAnswers(answersInTestCase: string[], givenAnswers: string[]): string[] {
  if (givenAnswers.length !== answersInTestCase.length) {
    return answersInTestCase.filter((it) => givenAnswers.includes(it));
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
      if (question.type !== QuestionType.Date) {
        engine.setAnswer(question.id, answerValue);
      } else {
        engine.setAnswer(question.id, Date.parse(answerValue) / 1000);
      }
      givenAnswers.push(question.id);
    } else {
      // answer was not provided in test case
      if (questionMode === "strict") {
        return {
          description,
          success: false,
          errorMessage: `No answer for question with ID "${question.id}" was provided, while questionMode is strict.`,
        };
      }
      if (!question.isOptional()) {
        return {
          description,
          success: false,
          errorMessage: `No answer for question with ID "${question.id}" was provided, while questionMode is normal and the question is not optional.`,
        };
      }
      engine.setAnswer(question.id, undefined);
    }

    question = engine.nextQuestion();
  }

  const unusedAnswers = findUnusedProvidedAnswers(Object.keys(testCase.answers), givenAnswers);
  if (questionMode === "strict" && unusedAnswers.length > 0) {
    return {
      description,
      success: false,
      errorMessage: `Not all provided answer were needed to fill the questionnaire: ${JSON.stringify(unusedAnswers)}`,
    };
  }

  return undefined;
}

function checkResults(results: Result[], testCase: TestCase): TestResultError | undefined {
  const mappedResults = results.reduce((prev, current) => {
    prev[current.resultCategory.id] = current.result.id;
    return prev;
  }, {} as any);

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
