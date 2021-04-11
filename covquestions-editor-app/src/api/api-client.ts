import { ISOLanguage, Questionnaire } from "@covopen/covquestions-js";
import { QuestionnaireBaseData } from "../models/QuestionnairesList";

const rootUrl = process.env.REACT_APP_API_URL || "";
const urlSuffix = ".json";

export async function getAllQuestionnaires(): Promise<QuestionnaireBaseData[]> {
  let url = rootUrl + "/questionnaires";
  if (process.env.NODE_ENV !== "production") {
    url += ".json";
  } else {
    url += urlSuffix;
  }
  let response = await fetch(url);
  if (response.ok) {
    return await response.json();
  }
  return [];
}

export async function getQuestionnaireByIdVersionAndLanguage(
  id: string,
  version: number,
  language: ISOLanguage
): Promise<Questionnaire | undefined> {
  const response = await fetch(`${rootUrl}/questionnaires/${id}/${version}/${language}${urlSuffix}`);
  if (response.ok) {
    return await response.json();
  }
  return undefined;
}

export async function getInstructions(): Promise<string | undefined> {
  const response = await fetch(`./INSTRUCTIONS.md`);
  if (response.ok) {
    return await response.text();
  }
  return undefined;
}
