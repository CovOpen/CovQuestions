export type QuestionnairesList = {
  id: string;
  title: string;
  path: string;
  version: number;
  meta: { author: string; availableLanguages: string[] };
}[];
