import * as fs from "fs";
import { loadSchema } from "./loadSchema";

fs.writeFileSync(
  "./react-with-json-logic/src/schemas/questionnaire.json",
  JSON.stringify(loadSchema(), null, 2)
);
