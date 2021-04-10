import { Questionnaire, runOneTestCase, TestCase, TestResult } from "@covopen/covquestions-js";

export function runTestCase(questionnaireJson: Questionnaire, testCase: TestCase): TestResult {
  return runOneTestCase(questionnaireJson, testCase);
}
