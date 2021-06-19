import { Questionnaire, TestCase } from "../models/Questionnaire.generated";
import { runOneTestCase, runTestCases } from "./testCaseRunner";

import contactQuestionWithDateAndSkipping from "./testCases/contactQuestionWithDateVariableAndSkippingQuestion.questionnaire";
import simpleBooleanContactQuestion from "./testCases/simpleBooleanContactQuestion.questionnaire";
import simpleMultiselectSymptomsQuestion from "./testCases/simpleMultiselectSymptomsQuestion.questionnaire";
import simpleNumericAgeQuestion from "./testCases/simpleNumericAgeQuestion.questionnaire";
import simpleSelectGenderQuestion from "./testCases/simpleSelectGenderQuestion.questionnaire";
import simpleTextQuestion from "./testCases/simpleTextQuestion.questionnaire";

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
  describe("complete questionnaire examples", () => {
    it("should run all test cases for contactQuestionWithDateVariableAndSkippingQuestion", () => {
      runTestCasesFor(contactQuestionWithDateAndSkipping);
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

  describe("questionMode", () => {
    const testCaseWithMissingOptionalAnswers: TestCase = {
      description: "Skipping the optional question should be possible",
      answers: {},
      results: {},
    };

    const testCaseWithTooManyAnswer: TestCase = {
      description: "Skipping the optional question should be possible",
      answers: { q1_text: "strange text", someOtherId: "something" },
      results: {},
    };

    it("should succeed to run in normal mode (default), if not all optional answers are provided", () => {
      const result = runOneTestCase(simpleTextQuestion, testCaseWithMissingOptionalAnswers);

      expect(result).toEqual({
        description: testCaseWithMissingOptionalAnswers.description,
        success: true,
      });
    });

    it("should succeed to run in strict mode, if not all optional answers are provided", () => {
      const result = runOneTestCase(simpleTextQuestion, {
        ...testCaseWithMissingOptionalAnswers,
        options: {},
      });

      expect(result).toEqual({
        description: testCaseWithMissingOptionalAnswers.description,
        success: true,
      });
    });

    it("should succeed to run in normal mode, if too many answers are provided", () => {
      const result = runOneTestCase(simpleTextQuestion, testCaseWithTooManyAnswer);

      expect(result).toEqual({
        description: testCaseWithTooManyAnswer.description,
        success: true,
      });
    });

    it("should fail to run, if not optional answers are not provided", () => {
      const result = runOneTestCase(simpleBooleanContactQuestion, {
        description: "some description",
        answers: {},
        results: {},
      });

      expect(result).toEqual({
        description: "some description",
        errorMessage:
          'No answer for question with ID "q1_contact" was provided, while questionMode is not random and the question is not optional.',
        success: false,
        answers: [],
      });
    });
  });

  describe("resultsMode", () => {
    const testCaseWithoutAllResults: TestCase = {
      description: "Skipping the optional question should be possible",
      answers: { q1_text: "test" },
      results: { rc_text: "TEXT" },
    };

    const questionnaireWithTwoResultCategories: Questionnaire = {
      ...simpleTextQuestion,
      resultCategories: [
        ...simpleTextQuestion.resultCategories,
        {
          id: "additionalCategory",
          description: "something",
          results: [{ id: "additionalResult", text: "some text", expression: true }],
        },
      ],
    };

    it("should succeed to run in normal mode, if not all results are provided", () => {
      const result = runOneTestCase(questionnaireWithTwoResultCategories, testCaseWithoutAllResults);

      expect(result).toEqual({
        description: testCaseWithoutAllResults.description,
        success: true,
      });
    });

    it("should fail to run in strict mode, if too many results are provided", () => {
      const result = runOneTestCase(questionnaireWithTwoResultCategories, {
        ...testCaseWithoutAllResults,
        options: { strictResults: true },
      });

      expect(result).toEqual({
        description: testCaseWithoutAllResults.description,
        errorMessage:
          'The execution provided additional results in strict mode: "additionalCategory: additionalResult"',
        success: false,
        answers: [
          {
            questionId: "q1_text",
            rawAnswer: "test",
          },
        ],
      });
    });

    it("should fail to run in normal mode, if wrong result is provided", () => {
      const result = runOneTestCase(simpleTextQuestion, {
        description: "Failing test",
        answers: { q1_text: "test" },
        results: { rc_text: "WRONG_RESULT_ID" },
      });

      expect(result).toEqual({
        description: "Failing test",
        success: false,
        errorMessage:
          'Wrong results: expected "rc_text: WRONG_RESULT_ID", but the questionnaire resulted in "rc_text: TEXT"',
        answers: [
          {
            questionId: "q1_text",
            rawAnswer: "test",
          },
        ],
      });
    });
  });

  describe("variables check", () => {
    const contactQuestionTestCaseDescription =
      "Contact within the last two weeks should lead to CONTACT_RELEVANT result";

    function contactQuestionTestCaseWithDate(q2ContactWhen: string) {
      return {
        description: contactQuestionTestCaseDescription,
        answers: {
          q1_contact: true,
          q2_contact_when: q2ContactWhen,
        },
        results: { rc_contact: "CONTACT_RELEVANT" },
        variables: {
          v_seconds_since_contact: "345600",
          v_contact_during_last_two_weeks: "true",
        },
        options: {
          fillInDate: "2020-03-18",
        },
      };
    }

    it("should succeed variable checks, if correct values are provided", () => {
      const testCase = contactQuestionTestCaseWithDate("2020-03-14");

      const result = runOneTestCase(contactQuestionWithDateAndSkipping, testCase);

      expect(result).toEqual({
        description: contactQuestionTestCaseDescription,
        success: true,
        errorMessage: undefined,
      });
    });

    it("should fail variable checks, if wrong values are provided", () => {
      const testCase = contactQuestionTestCaseWithDate("2020-03-15");

      const result = runOneTestCase(contactQuestionWithDateAndSkipping, testCase);

      expect(result).toEqual({
        description: contactQuestionTestCaseDescription,
        success: false,
        errorMessage: "Wrong variables: expected 'v_seconds_since_contact' to be '345600' but it is '259200'",
        answers: [
          {
            questionId: "q1_contact",
            rawAnswer: true,
          },
          {
            questionId: "q2_contact_when",
            rawAnswer: 1584230400,
          },
        ],
      });
    });
  });
});
