import * as Ajv from "ajv";
import * as fs from "fs-extra";
export function validate(paths: string[]) {
  var jsonValidator = new Ajv(); // options can be passed, e.g. {allErrors: true}
  var validate = jsonValidator.addSchema(
    require("../../../openapi/components/schemas/questionnaire.json"),
    "schema.json"
  );

  paths.forEach((path) => {
    var valid = jsonValidator.validate(
      "schema.json#/definitions/Questionnaire",
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
  });
}
