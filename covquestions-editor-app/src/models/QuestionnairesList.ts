import { ISOLanguage } from "covquestions-js";

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
