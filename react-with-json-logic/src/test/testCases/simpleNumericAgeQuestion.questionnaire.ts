import { Questionnaire, QuestionType } from "../../models/Questionnaire";

const testQuestionnaire: Questionnaire = {
  id: "simpleNumericAgeQuestion",
  schemaVersion: "1",
  version: "1",
  meta: {
    author: "Someone",
    language: "DE",
    title: "Simple numeric age question",
    creationDate: "2020-04-12T16:48:48+0000",
  },
  questions: [
    {
      id: "q1_age",
      text: "Wie alt sind Sie?",
      type: QuestionType.Number,
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
          value: {
            "<": [{ var: "q1_age.value" }, 18],
          },
        },
        {
          id: "AGE_ADULT",
          text: "Sie scheinen erwachsen zu sein.",
          value: true,
        },
      ],
    },
  ],
};

export default testQuestionnaire;
