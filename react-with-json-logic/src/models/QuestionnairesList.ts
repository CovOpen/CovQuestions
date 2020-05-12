export type QuestionnairesList = {
  id: string;
  title: string;
  path: string;
  version: string;
  meta: { author: string; availableLanguages: string[] };
}[];
