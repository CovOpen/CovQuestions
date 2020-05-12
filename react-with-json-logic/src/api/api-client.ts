import { Questionnaire } from "covquestions-js/models/Questionnaire.generated";

const rootUrl = process.env.REACT_APP_API_URL || "";

export async function getAllQuestionnaires(): Promise<any[]> {
  let url = rootUrl + "/questionnaires";
  if (process.env.NODE_ENV !== "production") {
    url += ".json";
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
  let response = await fetch(`${rootUrl}/questionnaires/${id}/${version}/${language}`);
  if (response.ok) {
    let result: Questionnaire = await response.json();
    return result;
  }
  return undefined;
}
