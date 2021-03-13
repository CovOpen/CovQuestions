import * as fs from 'fs';
const $RefParser = require('@apidevtools/json-schema-ref-parser');

var path = require('path');

// Set Working Directory to schema root
let root = path.join(__dirname, '../openapi/components/jsonSchemas');
process.chdir(root);

async function main() {
  let schema = JSON.stringify(
    await $RefParser.bundle(
      JSON.parse(
        fs.readFileSync('questionnaire.json', {
          encoding: 'utf-8',
        })
      )
    ),
    null,
    2
  );
  let outFile = path.join(__dirname, '../dist/questionnaire.json');

  fs.writeFileSync(outFile, schema);
  console.log(`Created bundled JSON Schema file: ${outFile}`);
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
