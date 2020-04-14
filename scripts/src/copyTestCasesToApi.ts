import * as fs from "fs";
import * as path from "path";

const testCasePath = path.join(
  __dirname,
  "../../react-with-json-logic/src/test/testCases/"
);

const apiBasePath = path.join(
  __dirname,
  "../../react-with-json-logic/public/api/"
);

const fileNames = fs.readdirSync(testCasePath);

fileNames.forEach((fileName: string) => {
  const questionnaire = require(testCasePath + fileName);
  const jsonPath = apiBasePath + questionnaire.default.id + ".json";
  fs.writeFileSync(
    jsonPath,
    JSON.stringify(questionnaire.default, undefined, 2)
  );
});
