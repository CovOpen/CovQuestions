import { ISOLanguage } from "covquestions-js/models/Questionnaire.generated";

export type QuestionnaireBaseData = {
  id: string;
  title: string;
  path: string;
  version: number;
  meta: {
    author: string;
    availableLanguages: ISOLanguage[];
  };
};
