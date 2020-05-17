import { Questionnaire } from "covquestions-js/models/Questionnaire.generated";

const testQuestionnaire: Questionnaire = {
  id: "simpleBooleanContactQuestion",
  schemaVersion: "1",
  version: 1,
  language: "en",
  title: "Simple boolean contact question",
  meta: {
    author: "Someone",
    availableLanguages: ["en"],
    creationDate: "2020-04-10T18:48:48+0000",
  },
  questions: [
    {
      id: "q1_contact",
      text: "Gab es Kontakt zu bestätigten Fällen?",
      type: "boolean",
    },
  ],
  variables: [],
  resultCategories: [
    {
      id: "rc_contact",
      description: "Kontakt",
      results: [
        {
          id: "CONTACT_YES",
          text: "Sie hatten Kontakt.",
          expression: {
            var: "q1_contact.value",
          },
        },
        {
          id: "CONTACT_NO",
          text: "Sie hatten keinen Kontakt.",
          expression: {
            "!": {
              var: "q1_contact.value",
            },
          },
        },
      ],
    },
  ],
  testCases: [
    {
      description: "yes should lead to yes",
      answers: { q1_contact: true },
      results: { rc_contact: "CONTACT_YES" },
    },
    {
      description: "no should lead to no",
      answers: { q1_contact: false },
      results: { rc_contact: "CONTACT_NO" },
    },
  ],
};

export default testQuestionnaire;
