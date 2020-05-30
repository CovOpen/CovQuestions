import { Questionnaire } from "covquestions-js/models/Questionnaire.generated";

const testQuestionnaire: Questionnaire = {
  id: "simpleMultiselectSymptomsQuestion",
  schemaVersion: "1",
  version: 1,
  language: "de",
  title: "Simple multiselect symptoms question",
  meta: {
    author: "Someone",
    availableLanguages: ["de", "en"],
    creationDate: "2020-04-13T13:48:48+0000",
  },
  questions: [
    {
      id: "q1_symptoms",
      text: "Welche der folgenden Symptome haben Sie?",
      type: "multiselect",
      optional: true,
      options: [
        {
          text: "Husten",
          value: "cough",
        },
        {
          text: "Schnupfen",
          value: "headCold",
        },
        {
          text: "Fieber",
          value: "fever",
        },
        {
          text: "Atemnot",
          value: "breathlessness",
        },
      ],
    },
  ],
  variables: [],
  resultCategories: [
    {
      id: "rc_symptoms",
      description: "Symptome",
      results: [
        {
          id: "MANY_SYMPTOMS",
          text: "Sie haben drei oder mehr Symptome.",
          expression: {
            ">=": [{ var: "q1_symptoms.selectedCount" }, 3],
          },
        },
        {
          id: "FEW_SYMPTOMS",
          text: "Sie haben ein oder zwei Symptome.",
          expression: {
            or: [
              {
                "==": [{ var: "q1_symptoms.selectedCount" }, 1],
              },
              {
                "==": [{ var: "q1_symptoms.selectedCount" }, 2],
              },
            ],
          },
        },
        {
          id: "NO_SYMPTOMS",
          text: "Sie haben keine Symptome.",
          expression: {
            "==": [{ var: "q1_symptoms.selectedCount" }, 0],
          },
        },
      ],
    },
  ],
  testCases: [
    {
      description: "Three symptoms",
      answers: { q1_symptoms: ["cough", "fever", "breathlessness"] },
      results: { rc_symptoms: "MANY_SYMPTOMS" },
    },
    {
      description: "Two symptoms",
      answers: { q1_symptoms: ["fever", "breathlessness"] },
      results: { rc_symptoms: "FEW_SYMPTOMS" },
    },
    {
      description: "No symptoms",
      answers: { q1_symptoms: [] },
      results: { rc_symptoms: "NO_SYMPTOMS" },
    },
  ],
};

export default testQuestionnaire;
