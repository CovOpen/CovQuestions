import { Questionnaire } from "covquestions-js/models/Questionnaire.generated";

const testQuestionnaire: Questionnaire = {
  id: "simpleSelectGenderQuestion",
  schemaVersion: "1",
  version: 1,
  language: "en",
  title: "Simple select gender question",
  meta: {
    author: "Someone",
    availableLanguages: ["en"],
    creationDate: "2020-04-13T13:48:48+0000",
  },
  questions: [
    {
      id: "q1_gender",
      text: "Geben Sie bitte ihr Geschlecht an?",
      type: "select",
      options: [
        {
          text: "weiblich",
          value: "female",
        },
        {
          text: "männlich",
          value: "male",
        },
        {
          text: "divers",
          value: "diverse",
        },
      ],
    },
  ],
  variables: [],
  resultCategories: [
    {
      id: "rc_gender",
      description: "Geschlecht",
      results: [
        {
          id: "GENDER_FEMALE",
          text: "Sie haben als Geschlecht 'weiblich' angegeben.",
          expression: {
            "==": [{ var: "q1_gender.value" }, "female"],
          },
        },
        {
          id: "GENDER_MALE",
          text: "Sie haben als Geschlecht 'männlich' angegeben.",
          expression: {
            "==": [{ var: "q1_gender.value" }, "male"],
          },
        },
        {
          id: "GENDER_DIVERSE",
          text: "Sie haben als Geschlecht 'divers' angegeben.",
          expression: {
            "==": [{ var: "q1_gender.value" }, "diverse"],
          },
        },
      ],
    },
  ],
  testCases: [
    {
      description: "The answer female should lead to female",
      answers: { q1_gender: "female" },
      results: { rc_gender: "GENDER_FEMALE" },
    },
    {
      description: "The answer male should lead to male",
      answers: { q1_gender: "male" },
      results: { rc_gender: "GENDER_MALE" },
    },
    {
      description: "The answer diverse should lead to diverse",
      answers: { q1_gender: "diverse" },
      results: { rc_gender: "GENDER_DIVERSE" },
    },
  ],
};

export default testQuestionnaire;
