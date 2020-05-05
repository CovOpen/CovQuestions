import { JSONSchema7 } from "json-schema";

export const testCaseMetaSchema: JSONSchema7 = {
  $ref: "#/definitions/TestCaseMeta",
  $schema: "http://json-schema.org/draft-07/schema#",
  definitions: {
    TestCaseMeta: {
      title: "Test case that simulates a virtual patient and the results they should receive.",
      type: "object",
      properties: {
        description: {
          description: "The description of the test case.",
          type: "string",
        },
        options: {
          title: "",
          type: "object",
          properties: {
            fillInDate: {
              description:
                "The simulated time of execution. Important for date questions, where the evaluation looks for time periods, like the last 14 days. Example: '2020-03-18'",
              type: "string",
            },
            questionMode: {
              description:
                "In normal and strict mode, optional questions are skipped (answered with undefined), if they are not explicitly set. In strict mode, each answer in the test case has to be requested during the questionnaire execution. In random mode, answers that are not provided are randomly chosen, answers that were provided, but not used are ignored.",
              type: "string",
              enum: ["strict", "random"],
            },
            resultsMode: {
              description:
                "If not set, the provided results have to appear after the questionnaire execution, additional results are allowed. If set, exactly the provided results has to appear.",
              type: "string",
              enum: ["strict"],
            },
            randomRuns: {
              description: "Number of random runs of the test case if questionMode is random",
              type: "number",
            },
          },
        },
      },
      required: ["description"],
    },
  },
};
