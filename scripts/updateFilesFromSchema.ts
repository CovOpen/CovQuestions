import * as fs from "fs";
import { loadSchema } from "./loadSchema";

fs.writeFileSync("./covquestions-editor-app/src/schemas/questionnaire.json", JSON.stringify(loadSchema(), null, 2));
