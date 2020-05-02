import * as Ajv from "ajv";
import * as fs from "fs-extra";
export function validate(path: string) {
  var jsonValidator = new Ajv(); // options can be passed, e.g. {allErrors: true}
  var validate = jsonValidator.addSchema(
    require("../../../openapi/components/schemas/questionnaire.json"),
    "schema.json"
  );

  var valid = jsonValidator.validate(
    "schema.json",
    JSON.parse(fs.readFileSync(path, "utf8"))
  );
  if (!valid)
    throw Error(
      `File ${path} does not match the JSON-Schema: \n${JSON.stringify(
        validate.errors,
        null,
        2
      )}`
    );
}
