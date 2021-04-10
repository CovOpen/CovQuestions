import { ISOLanguage } from "@covopen/covquestions-js";

const persistedParameters = ["id", "version", "language"] as const;

export interface QuestionnaireIdentification {
  id: string;
  version: number;
  language: ISOLanguage;
}

export function getQueryParams(): QuestionnaireIdentification {
  const queryParams = new URLSearchParams(window.location.search);
  return persistedParameters.reduce((obj, key) => {
    return { ...obj, [key]: queryParams.get(key) };
  }, {}) as any;
}

export function setQueryParams(selection: QuestionnaireIdentification): void {
  const queryParams = new URLSearchParams(window.location.search);
  persistedParameters.forEach((key) => {
    if ((selection as any)[key] != null) {
      queryParams.set(key, (selection as any)[key]);
    }
  });
  window.history.replaceState({}, "", `${window.location.pathname}?${queryParams}`);
}
