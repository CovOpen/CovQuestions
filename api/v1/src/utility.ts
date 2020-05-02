import { convert, create } from "xmlbuilder2";
import * as fs from "fs-extra";
import * as crypto from "crypto";
const { readdirSync } = require("fs");

const STRINGS_TO_TRANSLATE: string[] = [
  "title",
  "text",
  "asQuestion",
  "details",
  "description",
];
export const IDENTIFIER_REGEX: RegExp = /(.*)@@(.*)/;

export function readI18nFile(
  path: string
): { source: TranslationMap; target: TranslationMap; lang: string } {
  let transMapSource: TranslationMap = {};
  let transMapTarget: TranslationMap = {};
  let xliff = (convert(fs.readFileSync(path, { encoding: "utf-8" }), {
    format: "object",
  }) as any).xliff;

  (xliff.file.body["trans-unit"] as TransUnit[]).forEach((translation) => {
    transMapSource[translation["@id"]] = translation.source;
    transMapTarget[translation["@id"]] = translation.target["#"];
  });
  let lang = xliff.file["@target-language"];
  if (lang == null) {
    throw new Error(`No Target Lang specified in "${path}".`);
  }
  return { source: transMapSource, target: transMapTarget, lang: lang };
}

/**
 * Converts a string ressource to transStr and Id
 * or null if it is no ressource string
 * @param str [transString, id]
 */
export function getStringRessource(str: string): [string, string] {
  let [srcStr, trans, id] = str.match(IDENTIFIER_REGEX) || [null, null, null];
  return [trans, id];
}

export function md5(str: string): string {
  return crypto.createHash("md5").update(str).digest("hex");
}

export function doOnEachTranslation<T>(
  obj: T,
  func: (key, value, currObj: T) => void
) {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] == "object") {
      doOnEachTranslation(obj[key], func);
    }
    if (STRINGS_TO_TRANSLATE.includes(key)) {
      func(key, obj[key], obj);
    }
  });
  return obj;
}

export function writeJSONFile(path: string, json: Object) {
  fs.outputFileSync(
    path,
    JSON.stringify(json, null, process.env.DEVELOPMENT === "true" ? 2 : 0)
  );
}

export function getDirectories(source): string[] {
  return readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

export function replaceTranslationMap(
  map: TranslationMap,
  replacementMap: TranslationMap
): TranslationMap {
  return Object.keys(map).reduce((obj, key) => {
    obj[key] = replacementMap[key];
    return obj;
  }, {});
}

export interface TranslationMap {
  [id: string]: string;
}

export interface TransUnit {
  "@id": string;
  source: string;
  target: {
    "@state": string;
    "#": string;
  };
}
