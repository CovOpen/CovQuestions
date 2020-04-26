import * as fs from 'fs';
const {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
  JSONSchemaInput,
  JSONSchemaStore,
} = require('quicktype-core');

let jsonSchema = require('../openapi/components/schemas/questionnaire.json');
jsonSchema['$ref'] = '#/definitions/Questionnaire';

fs.writeFileSync(
  './react-with-json-logic/src/schemas/questionnaire.json',
  JSON.stringify(jsonSchema, null, 2)
);

async function quicktypeJSONSchema(targetLanguage, typeName, jsonSchemaString) {
  const schemaInput = new JSONSchemaInput(new JSONSchemaStore());

  // We could add multiple schemas for multiple types,
  // but here we're just making one type from JSON schema.
  await schemaInput.addSource({ name: typeName, schema: jsonSchemaString });

  const inputData = new InputData();
  inputData.addInput(schemaInput);

  return await quicktype({
    inputData,
    lang: targetLanguage,
  });
}

async function main() {
  const { lines: pythonPerson } = await quicktypeJSONSchema(
    'typescript',
    'Questionnaire',
    jsonSchema
  );
  console.log(pythonPerson.join('\n'));
}

main();
