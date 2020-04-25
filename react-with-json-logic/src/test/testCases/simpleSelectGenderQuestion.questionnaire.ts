import { Questionnaire, QuestionType } from "../../models/Questionnaire";

const testQuestionnaire: Questionnaire = {
  id: "simpleSelectGenderQuestion",
  schemaVersion: "1",
  version: "1",
  meta: {
    author: "Someone",
    language: "DE",
    title: "Simple select gender question",
    creationDate: "2020-04-13T13:48:48+0000",
  },
  questions: [
    {
      id: "q1_gender",
      text: "Geben Sie bitte ihr Geschlecht an?",
      type: QuestionType.Select,
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
          value: {
            "==": [{ var: "q1_gender.value" }, "female"],
          },
        },
        {
          id: "GENDER_MALE",
          text: "Sie haben als Geschlecht 'männlich' angegeben.",
          value: {
            "==": [{ var: "q1_gender.value" }, "male"],
          },
        },
        {
          id: "GENDER_DIVERSE",
          text: "Sie haben als Geschlecht 'divers' angegeben.",
          value: {
            "==": [{ var: "q1_gender.value" }, "diverse"],
          },
        },
      ],
    },
  ],
};

export default testQuestionnaire;
