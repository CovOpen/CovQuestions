import * as Ajv from "ajv";
import * as fs from "fs-extra";
import { runTestCases } from "covquestions-js/src/testCaseRunner";
import { Questionnaire } from "./models/Questionnaire.generated";

export function validate(path: string) {
  var jsonValidator = new Ajv(); // options can be passed, e.g. {allErrors: true}
  var validate = jsonValidator.addSchema(
    require("../../../openapi/components/schemas/questionnaire.json"),
    "schema.json"
  );

  const questionnaire = JSON.parse(fs.readFileSync(path, "utf8"));

  var valid = jsonValidator.validate("schema.json", questionnaire);
  if (!valid)
    throw Error(
      `File ${path} does not match the JSON-Schema: \n${JSON.stringify(
        validate.errors,
        null,
        2
      )}`
    );

  validateWithTestCases(questionnaire);
}

function validateWithTestCases(questionnaire: Questionnaire) {
  const testResults = runTestCases(questionnaire);
  if (testResults.some((testResult) => testResult.success === false)) {
    throw Error(
      `TestCases in questionnaire ${questionnaire.id} did not succeed.`
    );
  }
}
