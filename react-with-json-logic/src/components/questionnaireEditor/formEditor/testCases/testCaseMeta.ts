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
            strictResults: {
              description:
                "If false (default), the provided results have to appear after the questionnaire execution, additional results are allowed. If set, exactly the provided results have to appear.",
              type: "boolean",
            },
            randomRuns: {
              description:
                "If set to 0 (default): missing answer in the test case are not answered. If set to >= 1: missing answers in the test case are randomly answered. The number decides the number of random runs of this test case.",
              type: "number",
            },
          },
        },
      },
      required: ["description"],
    },
  },
};
