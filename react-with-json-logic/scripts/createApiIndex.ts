import * as fs from "fs";
import * as path from "path";

const apiBasePath = path.join(__dirname, "../public/api/");

const fileNames = fs.readdirSync(apiBasePath);

const questionnairesJson = fileNames
  .filter((fileName: string) => fileName !== "questionnaires.json")
  .map((fileName: string) => {
    const questionnaire = require(apiBasePath + fileName);
    return { name: questionnaire.title, path: "/" + fileName };
  });

const questionnairesJsonPath = apiBasePath + "questionnaires.json";
fs.writeFileSync(questionnairesJsonPath, JSON.stringify(questionnairesJson, undefined, 2));
