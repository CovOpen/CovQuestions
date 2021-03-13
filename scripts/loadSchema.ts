import * as fs from 'fs';

export function loadSchema(path = './openapi/components/schemas/questionnaire.json'): Object {
  return JSON.parse(
    fs
      .readFileSync(path, {
        encoding: 'utf-8',
      })
      .replace(/x-definitions/gm, 'definitions')
  );
}
