import * as fs from "fs-extra";
import { convert } from "xmlbuilder2";
import * as glob from "fast-glob";
import { readI18nFile, replaceTranslationMap } from "../src/utility";
import { Questionnaire } from "../src/models/Questionnaire.generated";
import { i18n_extract, writeI18nFile } from "./pre_build_add_new_file";

/**
 * Creates the local translation files for all questionnaires which don't have them.
 * It uses the main translation files of a questionnaire to generate them.
 *
 * Future: Provide a way to create a new version with updated translations.
 * @param dataDir Path to the data directory.
 */
export function pre_build_fixate_translations(dataDir = "./src/data") {
  let allQuestionnaires = glob.sync(`${dataDir}/**/*.json`);
  allQuestionnaires.forEach((questionnairePath) => {
    let questionnaire = JSON.parse(
      fs.readFileSync(questionnairePath, { encoding: "utf-8" })
    ) as Questionnaire;
    // Example "data/questionnaires/questionnaireId"
    let questionnaireDir = questionnairePath.split("/").slice(0, -2).join("/");
    // Example "data/questionnaires/questionnaireId/version/"
    let versionedDir = `${questionnaireDir}/${questionnaire.version}/`;
    // Example "data/questionnaires/questionnaireId/i18n"
    let mainI18nDir = `${questionnaireDir}/i18n/`;
    let mainI18nFilePaths = glob.sync(`${mainI18nDir}*.xlf`);

    let fixedI18nFiles = glob.sync(`${versionedDir}*.xlf`);
    if (fixedI18nFiles.length === 0) {
      let { sourceMap } = i18n_extract(questionnaire);
      mainI18nFilePaths.forEach((transFilePath) => {
        let { source, target, lang } = readI18nFile(transFilePath);
        let filteredSourceMap = replaceTranslationMap(sourceMap, source);
        let filteredTargetMap = replaceTranslationMap(sourceMap, target);

        writeI18nFile(
          `${questionnairePath.split(".").slice(0, -1).join(".")}.${lang}.xlf`,
          lang,
          filteredSourceMap,
          filteredTargetMap
        );
      });
    }
  });
}

pre_build_fixate_translations();
