import * as rimraf from 'rimraf';
import { main } from '../src';
import * as glob from 'fast-glob';
import * as fs from 'fs-extra';
const testDir = './dist-test';
const compareDir = './test/apiCompareFile';

describe('Simple JSON API Comparison', () => {
  glob.sync(`${compareDir}/**`).forEach((path) => {
    let comparisonPath = `${testDir}${path.slice(compareDir.length)}`;
    test(`compare ${path} with ${comparisonPath}`, () => {
      expect(fs.readFileSync(path, { encoding: 'utf-8' })).toBe(fs.readFileSync(comparisonPath, { encoding: 'utf-8' }));
    });
  });
});

beforeAll(() => {
  process.env.DEVELOPMENT = 'true';
  rimraf.sync(testDir);
  main('./test', testDir);
});

afterAll(() => {
  rimraf.sync(testDir);
});
