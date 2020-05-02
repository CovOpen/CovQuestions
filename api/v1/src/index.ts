import * as fs from 'fs-extra';
import { Questionnaire, QuestionnaireMeta, AnyQuestion } from './models/Questionnaire.generated';
import * as glob from 'fast-glob';
import { validate } from './validate';
import {
  loadTranslation,
  doOnEachTranslation,
  md5,
  getStringRessource,
  writeJSONFile,
  getDirectories,
} from './utility';
class TranslationNotCompleteError extends Error {
  constructor(m: string) {
    super(m);
  }
}

const API_PATHS = {
  QUESTIONNAIRES: '/questionnaires',
};

const SOURCE_PATHS = {
  QUESTIONNAIRES: '/data/questionnaires',
};

/**
 * Validates and generates the static API
 */
export function main(pwd: string = './src', outputDir: string = './dist') {
  console.log('Validating the Questionnaires...');
  glob.sync(`${pwd}/data/**/*.json`).forEach((q) => validate(q));

  let index: Questionnaire[] = [];

  // Build all Questionnaire
  console.log('Building the static API:');
  let questionnaireDirs = getDirectories(`${pwd}${SOURCE_PATHS.QUESTIONNAIRES}`);
  questionnaireDirs.forEach((questionnaireId) => {
    console.log(` - Building "${questionnaireId}"`);
    index = [...index, ...buildQuestionnaire(`${pwd}${SOURCE_PATHS.QUESTIONNAIRES}`, questionnaireId, outputDir)];
  });

  // Index Document
  let indexMap = index.reduce((accumulator, current, index, array) => {
    let slug = `${current.id}${current.version}`;
    if (accumulator[slug] != null) {
      accumulator[slug].availableLanguages.push(current.language);
    } else {
      accumulator[slug] = {
        id: current.id,
        availableLanguages: [current.language],
        meta: { ...current.meta, availableLanguages: undefined },
        version: current.version,
        path: `${API_PATHS.QUESTIONNAIRES}/${current.id}/${current.version}`,
      };
    }
    return accumulator;
  }, {} as { [key: string]: QuestionIndexEntry });
  writeJSONFile(
    `${outputDir}${API_PATHS.QUESTIONNAIRES}.json`,
    Object.keys(indexMap).map((key) => translateObject(indexMap[key]))
  );

  /**
   * Generate Questions
   */
  let questions: AnyQuestion[] = [];
  index.forEach((questionnaire) => {
    questionnaire.questions.forEach((q) => {
      if (questions.findIndex((filterQ) => filterQ.id == q.id) === -1) {
        questions.push(q);
      }
    });
  });

  writeJSONFile(
    `${outputDir}/questions.json`,
    questions.map((q) => translateObject(q))
  );

  console.log(`Finished. Output Directory: "${outputDir}"`);
}

export function buildQuestionnaire(
  sourceBaseDir: string,
  questionnaireId: string,
  outputPath: string
): Questionnaire[] {
  let questionnaireFilePaths = glob.sync(`${sourceBaseDir}/${questionnaireId}/**.json`);
  let translationFilePaths = glob.sync(`${sourceBaseDir}/${questionnaireId}/i18n/*.xlf`);

  // Retrieving available languages
  let languages: Language[] = translationFilePaths.map((p) => {
    return {
      path: p,
      translations: loadTranslation(p),
      id: p.match(/translation\.(\S*)\.xlf/)[1],
    };
  });

  let index: Questionnaire[] = [];
  /**
   * Generate the questionnaire JSON files
   */
  questionnaireFilePaths.forEach((path) => {
    let questionnaire: Questionnaire = JSON.parse(fs.readFileSync(path, 'utf-8'));
    // Test for same Ids
    if (questionnaire.id != questionnaireId) {
      throw new Error(`Id of Folder ("${questionnaireId}") does not match id "${questionnaire.id}" of ${path}`);
    }

    // Write Language Specific Questionnaire Files
    languages.forEach((lang) => {
      try {
        const translatedQuestionnaire = translateQuestionnaire(questionnaire, lang);
        translatedQuestionnaire.language = lang.id;
        questionnaire.language = lang.id;
        index.push(JSON.parse(JSON.stringify(questionnaire)));
        writeJSONFile(
          `${outputPath}${API_PATHS.QUESTIONNAIRES}/${questionnaire.id}/${questionnaire.version}/${lang.id}.json`,
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

    // Write Version Specififc Questionnaire Files (with translation Ids)
    writeJSONFile(
      `${outputPath}${API_PATHS.QUESTIONNAIRES}/${questionnaire.id}/${questionnaire.version}.json`,
      translateObject(questionnaire)
    );

    // Write latest Questionnaire File (with translation Ids)
    // writeJSONFile(
    //   `${outputPath}${API_PATHS.VIEWS_QUESTIONNAIRES}/${questionnaire.id}.json`,
    //   index.map((q) => {
    //     return {
    //       id: q.id,
    //       meta: q.meta,
    //       version: q.version,
    //       schemaVersion: q.schemaVersion,
    //     } as Partial<Questionnaire>;
    //   })
    // );
  });

  /**
   * Generate Language Files
   */
  languages.forEach((lang) => {
    writeJSONFile(
      `${outputPath}${API_PATHS.QUESTIONNAIRES}/${questionnaireId}/translations/${lang.id}.json`,
      lang.translations
    );
  });
  return index;
}

export function translateQuestionnaire(q: Questionnaire, lang: Language): Questionnaire {
  q.language = lang.id;

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
          `Questionnaire with id "${(o as any).id}" could not be translated, because there is no translation in "${
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
  version: number;
  availableLanguages: string[];
  meta: QuestionnaireMeta;
  path: string;
}
