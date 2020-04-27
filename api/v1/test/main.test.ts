import * as rimraf from 'rimraf';
import { main } from '../src';
import * as glob from 'fast-glob';
import * as fs from 'fs-extra';
import ajv = require('ajv');
const testDir = './dist-test';
const compareDir = './test/apiCompareFile';

describe('Simple JSON API File Comparison', () => {
  glob.sync(`${compareDir}/**`).forEach((path) => {
    let comparisonPath = `${testDir}${path.slice(compareDir.length)}`;
    test(`compare ${path} with ${comparisonPath}`, () => {
      expect(fs.readFileSync(path, { encoding: 'utf-8' })).toBe(
        fs.readFileSync(comparisonPath, { encoding: 'utf-8' })
      );
    });
  });
  test(`not to many files`, () => {
    expect(glob.sync(`${testDir}/**`).length).toBe(
      glob.sync(`${compareDir}/**`).length
    );
  });
});

describe('Validate JSON API Files to schema', () => {
  glob
    .sync(`${compareDir}/views/*/*/*/*.json`)
    .filter((p) => !p.match('translations'))
    .forEach((path) => {
      test(`validate ${path}`, () => {
        var jsonValidator = new ajv();
        var validate = jsonValidator.compile(
          require('../../../openapi/components/schemas/questionnaire.json')
        );

        expect(validate(JSON.parse(fs.readFileSync(path, 'utf8')))).toBe(true);
      });
    });
});

beforeAll(() => {
  process.env.DEVELOPMENT = 'true';
  rimraf.sync(testDir);
  main('./test', testDir);
});

afterAll(() => {
  // rimraf.sync(testDir);
});
