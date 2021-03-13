import { runOneTestCase } from "./testCaseRunner";
import { Questionnaire, TestCase } from "../models/Questionnaire.generated";

const testQuestionnaire: Questionnaire = {
  id: "allQuestionTypes",
  schemaVersion: "1",
  version: 1,
  language: "en",
  title: "All question types",
  meta: {
    author: "Someone",
    availableLanguages: ["en"],
    creationDate: "2020-04-13T13:48:48+0000",
  },
  questions: [
    {
      id: "selectQuestion",
      text: "Select one Option",
      type: "select",
      options: [
        {
          text: "Option1",
          value: "option1",
        },
        {
          text: "Option2",
          value: "option2",
        },
      ],
    },
    {
      id: "multiSelectQuestion",
      text: "Select any number of options",
      type: "multiselect",
      options: [
        {
          text: "Option1",
          value: "option1",
        },
        {
          text: "Option2",
          value: "option2",
        },
      ],
    },
    {
      id: "dateQuestion",
      text: "Select a date",
      type: "date",
    },
  ],
  variables: [],
  resultCategories: [
    {
      id: "selectResult",
      description: "result based only on select question",
      results: [
        {
          id: "option1Result",
          text: "Option1Result",
          expression: {
            var: "selectQuestion.option.option1",
          },
        },
      ],
    },
    {
      id: "multiSelectResult",
      description: "result based only on multiselect question",
      results: [
        {
          id: "onlyOption1Result",
          text: "onlyOption1Result",
          expression: {
            and: [
              {
                var: "multiSelectQuestion.option.option1",
              },
              {
                "==": [{ var: "multiSelectQuestion.selected_count" }, 1],
              },
            ],
          },
        },
      ],
    },
    {
      id: "dateResult",
      description: "result based only on date question",
      results: [
        {
          id: "dateBefore2020Result",
          text: "dateBefore2020Result",
          expression: {
            "<": [{ var: "dateQuestion" }, 1577878770],
          },
        },
        {
          id: "dateAfter2020Result",
          text: "dateAfter2020Result",
          expression: {
            ">": [{ var: "dateQuestion" }, 1577878770],
          },
        },
      ],
    },
  ],
  testCases: [],
};

describe("testCaseRunner", () => {
  describe("random test cases", () => {
    const randomTestCase: TestCase = {
      description: "Test should randomly select values",
      answers: {},
      results: {},
      options: {
        randomRuns: 1,
        fillInDate: "2020-01-01",
      },
    };

    it("should succeed in random mode if there are no results given", () => {
      const result = runOneTestCase(testQuestionnaire, randomTestCase);

      expect(result).toEqual({
        description: randomTestCase.description,
        success: true,
      });
    });

    it("should always find correct result for selectQuestion", () => {
      const testCase = {
        ...randomTestCase,
        answers: { selectQuestion: "option1" },
        results: { selectResult: "option1Result" },
      };

      const result = runOneTestCase(testQuestionnaire, testCase);

      expect(result).toEqual({
        description: randomTestCase.description,
        success: true,
      });
    });

    it("should always find correct result for multiSelectQuestion", () => {
      const testCase = {
        ...randomTestCase,
        answers: { multiSelectQuestion: ["option1"] },
        results: { multiSelectResult: "onlyOption1Result" },
      };

      const result = runOneTestCase(testQuestionnaire, testCase);

      expect(result).toEqual({
        description: randomTestCase.description,
        success: true,
      });
    });

    it("should always find correct result for dateQuestion - string format", () => {
      const testCase = {
        ...randomTestCase,
        answers: { dateQuestion: "2019-12-31" },
        results: { dateResult: "dateBefore2020Result" },
      };

      const result = runOneTestCase(testQuestionnaire, testCase);

      expect(result).toEqual({
        description: randomTestCase.description,
        success: true,
      });
    });

    it("should always find correct result for dateQuestion - number format", () => {
      const testCase = {
        ...randomTestCase,
        answers: { dateQuestion: 1577831407 }, //2019-12-31
        results: { dateResult: "dateBefore2020Result" },
      };

      const result = runOneTestCase(testQuestionnaire, testCase);

      expect(result).toEqual({
        description: randomTestCase.description,
        success: true,
      });
    });

    it("should always find correct result for dateQuestion (if out of bounds)", () => {
      const testCase = {
        ...randomTestCase,
        answers: { dateQuestion: "2020-01-20" },
        results: { dateResult: "dateAfter2020Result" },
      };

      const result = runOneTestCase(testQuestionnaire, testCase);

      expect(result).toEqual({
        description: randomTestCase.description,
        success: true,
      });
    });
  });
});
