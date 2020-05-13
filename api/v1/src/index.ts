import * as fs from "fs-extra";
import {
  Questionnaire,
  QuestionnaireMeta,
  AnyQuestion,
  ISOLanguage,
} from "./models/Questionnaire.generated";
import * as glob from "fast-glob";
import { validate } from "./validate";
import {
  readI18nFile,
  doOnEachTranslation,
  getStringRessource,
  writeJSONFile,
  getDirectories,
} from "./utility";
class TranslationNotCompleteError extends Error {
  constructor(m: string) {
    super(m);
  }
}

const API_PATHS = {
  QUESTIONNAIRES: "/questionnaires",
  QUESTIONS: "/questions",
};

export const SOURCE_PATHS = {
  QUESTIONNAIRES: "/questionnaires",
};

/**
 * Validates and generates the static API
 */
export function main(pwd: string = "./src/data", outputDir: string = "./dist") {
  console.log("Validating the Questionnaires...");
  glob.sync(`${pwd}/**/*.json`).forEach((q) => validate(q));

  let index: QuestionnaireWithLanguages[] = [];

  // Build all Questionnaires
  console.log("Building the static API:");
  let questionnaireDirs = getDirectories(
    `${pwd}${SOURCE_PATHS.QUESTIONNAIRES}`
  );
  questionnaireDirs.forEach((questionnaireId) => {
    console.log(` - Building "${questionnaireId}"`);
    index = [
      ...index,
      ...buildQuestionnaire(
        `${pwd}${SOURCE_PATHS.QUESTIONNAIRES}`,
        questionnaireId,
        outputDir
      ),
    ];
  });

  // Index Document
  let indexMap = index.reduce((accumulator, current, index, array) => {
    let slug = `${current.id}${current.version}`;
    accumulator[slug] = {
      id: current.id,
      title: current.title,
      meta: { ...current.meta },
      version: current.version,
      path: `${API_PATHS.QUESTIONNAIRES}/${current.id}/${current.version}`,
    };
    return accumulator;
  }, {} as { [key: string]: QuestionIndexEntry });
  writeJSONFile(
    `${outputDir}${API_PATHS.QUESTIONNAIRES}.json`,
    Object.keys(indexMap).map((key) =>
      translateObject(
        indexMap[key],
        index.find(
          (q) =>
            q.id === indexMap[key].id && q.version === indexMap[key].version
        ).languages.en
      )
    )
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
    `${outputDir}${API_PATHS.QUESTIONS}.json`,
    questions.map((q) => translateObject(q))
  );

  console.log(`Finished. Output Directory: "${outputDir}"`);
}

export function buildQuestionnaire(
  sourceBaseDir: string,
  questionnaireId: string,
  outputPath: string
): QuestionnaireWithLanguages[] {
  let questionnaireFilePaths = glob.sync(
    `${sourceBaseDir}/${questionnaireId}/**/*.json`
  );

  let index: Questionnaire[] = [];
  let indexWithLanguages: QuestionnaireWithLanguages[] = [];
  /**
   * Generate the questionnaire JSON files
   */
  questionnaireFilePaths.forEach((path) => {
    let questionnaire: Questionnaire = JSON.parse(
      fs.readFileSync(path, "utf-8")
    );
    let translationFilePaths = glob.sync(
      `${path.split("/").slice(0, -1).join("/")}/*.xlf`
    );

    // Retrieving available languages
    let languages: Language[] = translationFilePaths.map((p) => {
      return {
        path: p,
        translations: readI18nFile(p).target,
        id: readI18nFile(p).lang as ISOLanguage,
      };
    });

    /**
     * Generate Versioned Language Files
     */
    languages.forEach((lang) => {
      writeJSONFile(
        `${outputPath}${API_PATHS.QUESTIONNAIRES}/${questionnaireId}/${questionnaire.version}/translations/${lang.id}.json`,
        lang.translations
      );
    });

    // Test for same Ids
    if (questionnaire.id != questionnaireId) {
      throw new Error(
        `Id of Folder ("${questionnaireId}") does not match id "${questionnaire.id}" of ${path}`
      );
    }
    questionnaire.meta.availableLanguages = languages.map((l) => l.id);

    // Write Language Specific Questionnaire Files
    languages.forEach((lang) => {
      try {
        const translatedQuestionnaire = translateQuestionnaire(
          questionnaire,
          lang
        );

        index.push(JSON.parse(JSON.stringify(questionnaire)));
        indexWithLanguages.push(
          JSON.parse(
            JSON.stringify({
              ...questionnaire,
              languages: languages.reduce((acc, lang) => {
                return { ...acc, [lang.id]: lang };
              }, {}),
            })
          )
        );
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
      translateQuestionnaire(questionnaire)
    );

    // Write latest Questionnaire File (with translation Ids)
    writeJSONFile(
      `${outputPath}${API_PATHS.QUESTIONNAIRES}/${questionnaire.id}/latest.json`,
      translateQuestionnaire(
        index.reduce((prev, curr) => {
          if (prev.version > curr.version) {
            return prev;
          }
          return curr;
        }, index[0])
      )
    );
  });

  /**
   * Generate Main Language Files
   */
  let translationFilePaths = glob.sync(
    `${sourceBaseDir}/${questionnaireId}/i18n/*.xlf`
  );

  // Retrieving available languages
  let languages: Language[] = translationFilePaths.map((p) => {
    return {
      path: p,
      translations: readI18nFile(p).target,
      id: readI18nFile(p).lang as ISOLanguage,
    };
  });

  languages.forEach((lang) => {
    writeJSONFile(
      `${outputPath}${API_PATHS.QUESTIONNAIRES}/${questionnaireId}/translations/${lang.id}.json`,
      lang.translations
    );
  });
  return indexWithLanguages;
}

export function translateQuestionnaire(
  q: Questionnaire,
  lang: Language = { id: "none", path: null, translations: {} }
): Questionnaire {
  q.language = lang.id;

  return translateObject(q, lang);
}

export function translateObject<T = any>(
  o: T,
  lang: Language = { id: "none", path: null, translations: {} }
): T {
  // Dereferrencing the object so there are no side effects
  o = JSON.parse(JSON.stringify(o));

  doOnEachTranslation(o, (key, value, obj) => {
    let [trans, id] = getStringRessource(value);
    if (id == null) {
      throw new TranslationNotCompleteError(
        `The string "${value}" has no ID. Please run translation extraction before.`
      );
    }
    if (lang.id != "none") {
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
  id: ISOLanguage;
  path: string;
  translations: { [key: string]: string };
}

interface QuestionIndexEntry {
  id: string;
  title: string;
  version: number;
  meta: QuestionnaireMeta;
  path: string;
}

interface QuestionnaireWithLanguages extends Questionnaire {
  languages: { [lang: string]: Language };
}
