import * as fs from 'fs-extra';
import { convert } from 'xmlbuilder2';
import * as glob from 'fast-glob';
import { validate } from '../src/validate';
import { md5, doOnEachTranslation, IDENTIFIER_REGEX, getStringRessource } from '../src/utility';

const defaultFile = 'translation.en.xlf';

const xmlBase = {
  xliff: {
    '@version': '1.2',
    file: {
      '@datatype': 'plaintext',
      '@source-language': 'en',
      body: {},
    },
  },
};

const tranlationMap: { [id: string]: string } = {};

export async function i18n_extract(srcGlob: string = './src/data/**/*.json', outDir: string = './src/i18n') {
  let questionnairePaths = glob.sync(srcGlob);
  validate(questionnairePaths);

  // Goes through each file and extracts the
  questionnairePaths.forEach((path) => {
    const newfile = doOnEachTranslation(JSON.parse(fs.readFileSync(path, { encoding: 'utf-8' })), (key, value, obj) => {
      addTranslation(obj[key], obj, key);
    });
    fs.writeFileSync(path, JSON.stringify(newfile));
  });

  // Adds the translation to the xliff skeleton and writes
  xmlBase.xliff.file.body['trans-unit'] = Object.keys(tranlationMap).map((key) => {
    return {
      '@id': key,
      source: tranlationMap[key],
      target: {
        '@state': 'translated',
        '#': tranlationMap[key],
      },
    };
  });

  console.log(`Extracted ${Object.keys(tranlationMap).length} Translation Entities.`);

  fs.outputFileSync(`${outDir}/${defaultFile}`, convert(xmlBase));
}

export function addTranslation(str: string, obj: Object, key: string) {
  // We should't use md5 from source, if source is updated all other references are lost.
  // TODO: Make sure every object with strings for translation has a unqiue id (this makes reusing the objects easier aswell)
  let [trans, id] = getStringRessource(str);
  if (id != null) {
    str = trans;
  } else {
    id = md5(str);
    obj[key] = `${str}@@${id}`;
  }
  if (tranlationMap[id] != null && tranlationMap[id] !== str) {
    throw new Error(`Different Translations detected.`);
  }
  tranlationMap[id] = str;
}

i18n_extract();
