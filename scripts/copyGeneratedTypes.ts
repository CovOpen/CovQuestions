import * as fs from "fs";
import { generatedTypesOutputPath } from "./generateTypes";

fs.copyFileSync(
  generatedTypesOutputPath,
  "./covquestions-js/models/Questionnaire.generated.ts"
);

fs.copyFileSync(
  generatedTypesOutputPath,
  "./api/v1/src/models/Questionnaire.generated.ts"
);
