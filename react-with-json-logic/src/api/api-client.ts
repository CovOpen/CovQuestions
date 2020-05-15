import { ISOLanguage, Questionnaire } from "covquestions-js/models/Questionnaire.generated";
import { QuestionnaireBaseData, QuestionnairesList } from "../models/QuestionnairesList";

const rootUrl = process.env.REACT_APP_API_URL || "";

export async function getAllQuestionnaires(): Promise<QuestionnairesList> {
  let url = rootUrl + "/questionnaires";
  if (process.env.NODE_ENV !== "production") {
    url += ".json";
  }
  let response = await fetch(url);
  if (response.ok) {
    let questionnaires: QuestionnaireBaseData[] = await response.json();
    let result: QuestionnairesList = {};
    for (let questionnaire of questionnaires) {
      result[questionnaire.id] = result[questionnaire.id] || [];
      result[questionnaire.id].push(questionnaire);
    }
    return result;
  }
  return {};
}

export async function getQuestionnaireByIdVersionAndLanguage(
  id: string,
  version: number,
  language: ISOLanguage
): Promise<Questionnaire | undefined> {
  const response = await fetch(`${rootUrl}/questionnaires/${id}/${version}/${language}`);
  if (response.ok) {
    return await response.json();
  }
  return undefined;
}
