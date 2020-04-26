import * as fs from "fs-extra";
import {
  Questionnaire,
  QuestionnaireMeta,
  AnyQuestion,
} from "../../../react-with-json-logic/src/models/Questionnaire";
import * as glob from "fast-glob";
import { validate } from "./validate";
import {
  loadTranslation,
  doOnEachTranslation,
  md5,
  getStringRessource,
  writeJSONFile,
} from "./utility";
class TranslationNotCompleteError extends Error {
  constructor(m: string) {
    super(m);
  }
}

const PATHS = {
  VIEWS_QUESTIONNAIRES: "/views/questionnaires",
};

/**
 * Validates and generates the static API
 */
export function main(pwd: string = "./src", outputDir: string = "./dist") {
  // Get all Questionnaire
  let questionnaireFilePaths = glob.sync(`${pwd}/data/**/*.json`);
  let translationFilePaths = glob.sync(`${pwd}/i18n/*.xlf`);

  console.log("Validating the Questionnaires...");
  validate(questionnaireFilePaths);

  console.log("Building the static API");
  build(questionnaireFilePaths, translationFilePaths, outputDir);
  console.log(`Build API. Output Directory: "${outputDir}"`);
}

export function build(
  questionnaireFilePaths: string[],
  translationFilePaths: string[],
  outputPath: string
) {
  let index: Questionnaire[] = [];

  // Retrieving available languages
  let languages: Language[] = translationFilePaths.map((p) => {
    return {
      path: p,
      translations: loadTranslation(p),
      id: p.match(/translation\.(\S*)\.xlf/)[1],
    };
  });

  /**
   * Generate the questionnaire JSON files
   */
  questionnaireFilePaths.forEach((path) => {
    let questionnaire: Questionnaire = JSON.parse(
      fs.readFileSync(path, "utf-8")
    );

    // Languages Files
    languages.forEach((lang) => {
      try {
        const translatedQuestionnaire = translateQuestionnaire(
          questionnaire,
          lang
        );
        index.push(questionnaire);
        writeJSONFile(
          `${outputPath}${PATHS.VIEWS_QUESTIONNAIRES}/${questionnaire.id}/${questionnaire.version}/${lang.id}.json`,
          translatedQuestionnaire
        );
      } catch (e) {
        if (e instanceof TranslationNotCompleteError) {
          console.warn(`WARNING: ${e}`);
        } else {
          throw e;
        }
      }
    });
    writeJSONFile(
      `${outputPath}${PATHS.VIEWS_QUESTIONNAIRES}/${questionnaire.id}/${questionnaire.version}.json`,
      translateObject(questionnaire)
    );
  });

  // Index Document
  let indexMap = index.reduce((accumulator, current, index, array) => {
    if (accumulator[current.id] != null) {
      accumulator[current.id].availableLanguages.push(current.meta.language);
    } else {
      accumulator[current.id] = {
        id: current.id,
        availableLanguages: [current.meta.language],
        meta: { ...current.meta, language: undefined },
        version: current.version,
        path: `${PATHS.VIEWS_QUESTIONNAIRES}/${current.id}/${current.version}`,
      };
    }
    return accumulator;
  }, {} as { [key: string]: QuestionIndexEntry });
  writeJSONFile(
    `${outputPath}${PATHS.VIEWS_QUESTIONNAIRES}.json`,
    Object.keys(indexMap).map((key) => translateObject(indexMap[key]))
  );

  /**
   * Generate Questions
   */
  let questions: AnyQuestion[] = [];
  questionnaireFilePaths.forEach((path) => {
    let questionnaire: Questionnaire = JSON.parse(
      fs.readFileSync(path, "utf-8")
    );
    questions = [...questions, ...questionnaire.questions];
  });
  writeJSONFile(
    `${outputPath}/questions.json`,
    questions.map((q) => translateObject(q))
  );

  /**
   * Generate Language Files
   */
  languages.forEach((lang) => {
    writeJSONFile(
      `${outputPath}/translations/${lang.id}.json`,
      lang.translations
    );
  });
}

export function translateQuestionnaire(
  q: Questionnaire,
  lang: Language
): Questionnaire {
  q.meta.language = lang.id;

  return translateObject(q, lang);
}

export function translateObject<T = any>(o: T, lang: Language = null): T {
  // Dereferrencing the object so there are no side effects
  o = JSON.parse(JSON.stringify(o));

  doOnEachTranslation(o, (key, value, obj) => {
    let [trans, id] = getStringRessource(value);
    if (id == null) {
      throw new TranslationNotCompleteError(
        `The string "${value}" has no ID. Please run translation extraction before.`
      );
    }
    if (lang != null) {
      let translation = lang.translations[id];
      if (translation == null) {
        throw new TranslationNotCompleteError(
          `Questionnaire with id "${
            (o as any).id
          }" could not be translated, because there is no translation in "${
            lang.id
          }" for "${key}" (${value})`
        );
      }
      obj[key] = translation;
    } else {
      // If no language is provide write the id
      obj[key] = id;
    }
  });
  return o;
}

interface Language {
  id: string;
  path: string;
  translations: { [key: string]: string };
}

interface QuestionIndexEntry {
  id: string;
  version: string;
  availableLanguages: string[];
  meta: QuestionnaireMeta;
  path: string;
}
