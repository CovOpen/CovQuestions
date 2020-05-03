import * as fs from "fs";

export function loadSchema(): Object {
  return JSON.parse(
    fs
      .readFileSync("./openapi/components/schemas/questionnaire.json", {
        encoding: "utf-8",
      })
      .replace(/x-definitions/gm, "definitions")
  );
}
