import * as fs from "fs";
import * as path from "path";
import { QuestionnaireBaseData } from "../src/models/QuestionnairesList";

const testCasePath = path.join(__dirname, "../src/test/testCases/");

const apiBasePath = path.join(__dirname, "../public/api/");
const questionnairesBasePath = `${apiBasePath}questionnaires/`;

const fileNames = fs.readdirSync(testCasePath);

const questionnairesIndex: QuestionnaireBaseData[] = [];

fileNames.forEach((fileName: string) => {
  const { default: questionnaire } = require(testCasePath + fileName);

  const path = `${questionnairesBasePath}${questionnaire.id}/${questionnaire.version}/`;
  fs.mkdirSync(path, { recursive: true });

  fs.writeFileSync(`${path}${questionnaire.language}`, JSON.stringify(questionnaire, undefined, 2));

  if (
    questionnairesIndex.find((it) => it.id === questionnaire.id && it.version === questionnaire.version) === undefined
  ) {
    questionnairesIndex.push({
      id: questionnaire.id,
      title: questionnaire.title,
      path: `/questionnaires/${questionnaire.id}/${questionnaire.version}/${questionnaire.language}`,
      version: questionnaire.version,
      meta: { author: questionnaire.meta.author, availableLanguages: questionnaire.meta.availableLanguages },
    });
  }
});

fs.writeFileSync(`${apiBasePath}questionnaires.json`, JSON.stringify(questionnairesIndex, undefined, 2));
