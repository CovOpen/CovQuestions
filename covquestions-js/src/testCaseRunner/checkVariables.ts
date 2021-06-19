import { TestCase } from "../models/Questionnaire.generated";
import { TestResultError } from "./testCaseRunner";
import { Primitive } from "../primitive";

function isEqualToStringRepresentation(expected: string, actual: Primitive | undefined): boolean {
  if (actual === undefined) {
    return false;
  }

  if (typeof actual === "boolean") {
    if (actual) {
      return expected === "true";
    } else {
      return expected === "false";
    }
  }

  if (typeof actual === "number") {
    return parseInt(expected) === actual || parseFloat(expected) === actual;
  }

  return expected === actual;
}

export function checkVariables(
  executionVariables: { [key: string]: any },
  testCase: TestCase
): TestResultError | undefined {
  if (testCase.variables === undefined) {
    return undefined;
  }

  const variableCheckErrors: string[] = Object.entries(testCase.variables)
    .map(([id, expected]) => {
      const actual = executionVariables[id];
      if (isEqualToStringRepresentation(expected, actual)) {
        return undefined;
      } else {
        return `expected '${id}' to be '${expected}' but it is '${actual}'`;
      }
    })
    .filter(notUndefined);

  if (variableCheckErrors.length > 0) {
    return {
      description: testCase.description,
      success: false,
      errorMessage: `Wrong variables: ${variableCheckErrors}`,
    };
  }

  return undefined;
}

function notUndefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}
