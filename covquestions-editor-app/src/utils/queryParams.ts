import { QuestionnaireSelection } from "../components/questionnaireSelection/QuestionnaireSelection";

let persistedParameters = ["id", "version", "language"];

export function getQueryParams(): QuestionnaireSelection {
  const queryParams = new URLSearchParams(window.location.search);
  return persistedParameters.reduce((obj, key) => {
    return { ...obj, [key]: queryParams.get(key) };
  }, {});
}

export function setQueryParams(selection: QuestionnaireSelection): void {
  const queryParams = new URLSearchParams(window.location.search);
  persistedParameters.forEach((key) => {
    if ((selection as any)[key] != null) {
      queryParams.set(key, (selection as any)[key]);
    }
  });
  window.history.replaceState({}, "", `${window.location.pathname}?${queryParams}`);
}
