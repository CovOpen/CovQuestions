import { Questionnaire, QuestionType } from "../../models/Questionnaire";

const testQuestionnaire: Questionnaire = {
  id: "simpleMultiselectSymptomsQuestion",
  schemaVersion: "1",
  version: "1",
  meta: {
    author: "Someone",
    language: "DE",
    title: "Simple multiselect symptoms question",
    creationDate: "2020-04-13T13:48:48+0000",
  },
  questions: [
    {
      id: "q1_symptoms",
      text: "Welche der folgenden Symptome haben Sie?",
      type: QuestionType.Multiselect,
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
          value: {
            ">=": [{ var: "q1_symptoms.selectedCount" }, 3],
          },
        },
        {
          id: "FEW_SYMPTOMS",
          text: "Sie haben ein oder zwei Symptome.",
          value: {
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
          value: {
            "==": [{ var: "q1_symptoms.selectedCount" }, 0],
          },
        },
      ],
    },
  ],
};

export default testQuestionnaire;
