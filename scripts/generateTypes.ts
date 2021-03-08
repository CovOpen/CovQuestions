import * as fs from "fs";
import { compile } from "json-schema-to-typescript";
import { loadSchema } from "./loadSchema";

export const generatedTypesOutputPath = "dist/Questionnaire.generated.ts";

function addAdditionalProperties(schema: object): { [key: string]: any } {
  if (Array.isArray(schema)) {
    return [...schema];
  }

  const keys = Object.keys(schema);
  if (keys.includes("properties")) {
    return { ...schema, additionalProperties: false };
  }
  return schema;
}

function addAdditionalPropertiesRecursively(schema: object): object {
  if (typeof schema !== "object") {
    return schema;
  }

  const schemaWithAdditionalProps = addAdditionalProperties(schema);

  for (const key of Object.keys(schemaWithAdditionalProps)) {
    schemaWithAdditionalProps[key] = addAdditionalPropertiesRecursively(
      schemaWithAdditionalProps[key]
    );
  }
  return schemaWithAdditionalProps;
}

fs.mkdirSync("dist", { recursive: true });

compile(
  addAdditionalPropertiesRecursively(loadSchema()),
  "Questionnaire"
).then((ts: string) => fs.writeFileSync(generatedTypesOutputPath, ts));
