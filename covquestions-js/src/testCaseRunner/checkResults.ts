import { Result } from "../questionnaireEngine";
import { TestCase } from "../models/Questionnaire.generated";
import { TestResultError } from "./testCaseRunner";

export function checkResults(executionResults: Result[], testCase: TestCase): TestResultError | undefined {
  const { description } = testCase;

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
      errorMessage: `Wrong results: expected "${testCaseResultStrings}", but the questionnaire resulted in "${executionResultStrings}"`,
    };
  }

  if (testCase.options === undefined || !testCase.options.strictResults) {
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

function findUnusedElements(arrayWithPossibleUnusedElements: string[], subSetOfFirstArray: string[]): string[] {
  if (subSetOfFirstArray.length !== arrayWithPossibleUnusedElements.length) {
    return arrayWithPossibleUnusedElements.filter((it) => !subSetOfFirstArray.includes(it));
  }

  return [];
}
