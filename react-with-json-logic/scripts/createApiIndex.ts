import * as fs from "fs";
import * as path from "path";

const apiBasePath = path.join(__dirname, "../public/api/");

const fileNames = fs.readdirSync(apiBasePath);

const indexJson = fileNames
  .filter((fileName: string) => fileName !== "index.json")
  .map((fileName: string) => {
    const questionnaire = require(apiBasePath + fileName);
    return { name: questionnaire.title, path: "api/" + fileName };
  });

const indexJsonPath = apiBasePath + "index.json";
fs.writeFileSync(indexJsonPath, JSON.stringify(indexJson, undefined, 2));
