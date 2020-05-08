import * as fs from "fs";
import * as path from "path";

const apiBasePath = path.join(__dirname, "../public/api/");

const fileNames = fs.readdirSync(apiBasePath);

const questionnairesJson = fileNames
  .filter((fileName: string) => fileName !== "questionnaires.json")
  .map((fileName: string) => {
    const questionnaire = require(apiBasePath + fileName);
    return { id: questionnaire.id, title: questionnaire.title, path: "/" + fileName, version: questionnaire.version, meta: {author: questionnaire.meta.author, availableLanguages: questionnaire.meta.availableLanguages} };
  });

const questionnairesJsonPath = apiBasePath + "questionnaires.json";
fs.writeFileSync(questionnairesJsonPath, JSON.stringify(questionnairesJson, undefined, 2));
