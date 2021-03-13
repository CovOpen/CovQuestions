import * as fs from 'fs';
import { dirname } from 'path';
import { loadSchema } from './loadSchema';
const $RefParser = require('@apidevtools/json-schema-ref-parser');
const convert = require('@openapi-contrib/json-schema-to-openapi-schema');

var path = require('path');

// Set Working Directory to schema root
let root = path.join(__dirname, '../openapi/components/jsonSchemas');
process.chdir(root);

async function main() {
  let schema = JSON.stringify(
    await convert(
      await $RefParser.bundle(
        JSON.parse(
          fs.readFileSync('questionnaire.json', {
            encoding: 'utf-8',
          })
        )
      )
    ),
    null,
    2
  )
    .replace(/definitions/gm, 'x-definitions')
    .replace(/dependencies/gm, 'x-dependencies');

  fs.writeFileSync('../schemas/questionnaire.json', schema);
  // let questions = $RefParser.bundle(schema.properties.questions.items, (err: any, schema: any) => {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log(schema);
  //   }
  // });
  // // console.log(schema.properties.questions.items);
  // // let value = $refs.get('schemas/people/Bruce-Wayne.json#/properties/address');
  // // `schema` is just a normal JavaScript object that contains your entire JSON Schema,
  // // including referenced files, combined into a single object
  // console.log(schema['x-definitions']);
}

main();
