import * as fs from "fs";

let jsonSchema = require("../openapi/components/schemas/questionnaire.json");

fs.writeFileSync(
  "./react-with-json-logic/src/schemas/questionnaire.json",
  JSON.stringify(jsonSchema, null, 2)
);
