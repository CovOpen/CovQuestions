import { convert } from 'xmlbuilder2';
import * as fs from 'fs-extra';
import * as crypto from 'crypto';
const STRINGS_TO_TRANSLATE: string[] = ['title', 'text', 'asQuestion', 'details', 'description'];

export function loadTranslation(path: string): { [id: string]: string } {
  let translationMap = {};
  ((convert(fs.readFileSync(path, { encoding: 'utf-8' }), { format: 'object' }) as any).xliff.file.body[
    'trans-unit'
  ] as any[]).forEach((translation) => {
    translationMap[translation['@id']] = translation.target['#'];
  });
  return translationMap;
}

export function md5(str: string): string {
  return crypto.createHash('md5').update(str).digest('hex');
}

export function doOnEachTranslation<T>(obj: T, func: (key, value, currObj: T) => void) {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] == 'object') {
      doOnEachTranslation(obj[key], func);
    }
    if (STRINGS_TO_TRANSLATE.includes(key)) {
      func(key, obj[key], obj);
    }
  });
  return obj;
}
