import * as fs from "fs";
import * as path from "path";

const testCasePath = path.join(__dirname, "../src/test/testCases/");

const questionnairesBasePath = path.join(__dirname, "../public/api/questionnaires/");

const fileNames = fs.readdirSync(testCasePath);

fileNames.forEach((fileName: string) => {
  const questionnaire = require(testCasePath + fileName);
  let path = `${questionnairesBasePath}${questionnaire.default.id}/`;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  path = `${questionnairesBasePath}${questionnaire.default.id}/${questionnaire.default.version}/`;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  fs.writeFileSync(`${path}${questionnaire.default.language}`, JSON.stringify(questionnaire.default, undefined, 2));
});
