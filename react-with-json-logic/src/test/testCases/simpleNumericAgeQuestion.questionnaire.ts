import { Questionnaire } from "covquestions-js/models/Questionnaire.generated";

const testQuestionnaire: Questionnaire = {
  id: "simpleNumericAgeQuestion",
  schemaVersion: "1",
  version: 1,
  language: "en",
  title: "Simple numeric age question",
  meta: {
    author: "Someone",
    availableLanguages: ["en"],
    creationDate: "2020-04-12T16:48:48+0000",
  },
  questions: [
    {
      id: "q1_age",
      text: "Wie alt sind Sie?",
      type: "number",
      numericOptions: {
        min: 0,
        max: 150,
        step: 1,
      },
    },
  ],
  variables: [],
  resultCategories: [
    {
      id: "rc_age",
      description: "Alter",
      results: [
        {
          id: "AGE_CHILD",
          text: "Du bist ja noch ein Kind.",
          expression: {
            "<": [{ var: "q1_age.value" }, 18],
          },
        },
        {
          id: "AGE_ADULT",
          text: "Sie scheinen erwachsen zu sein.",
          expression: true,
        },
      ],
    },
  ],
  testCases: [
    {
      description: "Age below 18 should lead to the AGE_CHILD result",
      answers: { q1_age: 6 },
      results: { rc_age: "AGE_CHILD" },
    },
    {
      description: "Age above 18 should lead to the AGE_ADULT result",
      answers: { q1_age: 21 },
      results: { rc_age: "AGE_ADULT" },
    },
  ],
};

export default testQuestionnaire;
