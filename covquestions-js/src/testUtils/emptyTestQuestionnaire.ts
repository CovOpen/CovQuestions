import { Questionnaire } from "../models/Questionnaire.generated";

export const emptyTestQuestionnaire: Questionnaire = {
  id: "allQuestionTypes",
  schemaVersion: "1",
  version: 1,
  language: "en",
  title: "All question types",
  meta: {
    author: "Someone",
    availableLanguages: ["en"],
    creationDate: "2020-04-13T13:48:48+0000",
  },
  questions: [],
  variables: [],
  resultCategories: [],
  testCases: [],
};
