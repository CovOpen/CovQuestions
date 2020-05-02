import { runTestCases } from "./testCaseRunner";
import { Questionnaire } from "../models/Questionnaire";
import contactQuestionWithDateVariableAndSkippingQuestion
  from "../test/testCases/contactQuestionWithDateVariableAndSkippingQuestion.questionnaire";
import simpleBooleanContactQuestion from "../test/testCases/simpleBooleanContactQuestion.questionnaire";
import simpleMultiselectSymptomsQuestion from "../test/testCases/simpleMultiselectSymptomsQuestion.questionnaire";
import simpleNumericAgeQuestion from "../test/testCases/simpleNumericAgeQuestion.questionnaire";
import simpleSelectGenderQuestion from "../test/testCases/simpleSelectGenderQuestion.questionnaire";
import simpleTextQuestion from "../test/testCases/simpleTextQuestion.questionnaire";

function runTestCasesFor(questionnaire: Questionnaire) {
  if (questionnaire.testCases === undefined) {
    throw Error("No test cases provided");
  }

  const expectEveryTestCaseToPass = questionnaire.testCases.map(({ description }) => ({
    description,
    success: true,
  }));

  const results = runTestCases(questionnaire);

  expect(results).toEqual(expectEveryTestCaseToPass);
}

describe("testCaseRunner", () => {
  it("should run all test cases for contactQuestionWithDateVariableAndSkippingQuestion", () => {
    runTestCasesFor(contactQuestionWithDateVariableAndSkippingQuestion);
  });

  it("should run all test cases for simpleBooleanContactQuestion", () => {
    runTestCasesFor(simpleBooleanContactQuestion);
  });

  it("should run all test cases for simpleMultiselectSymptomsQuestion", () => {
    runTestCasesFor(simpleMultiselectSymptomsQuestion);
  });

  it("should run all test cases for simpleNumericAgeQuestion", () => {
    runTestCasesFor(simpleNumericAgeQuestion);
  });

  it("should run all test cases for simpleSelectGenderQuestion", () => {
    runTestCasesFor(simpleSelectGenderQuestion);
  });

  it("should run all test cases for simpleTextQuestion", () => {
    runTestCasesFor(simpleTextQuestion);
  });
});
