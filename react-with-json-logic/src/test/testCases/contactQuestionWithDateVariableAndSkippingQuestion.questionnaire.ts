import { Questionnaire } from "covquestions-js/models/Questionnaire.generated";

const testQuestionnaire: Questionnaire = {
  id: "contactQuestionWithDateVariableAndSkippingQuestion",
  schemaVersion: "1",
  version: 1,
  language: "de",
  title: "Contact question with date variable and skipping a question",
  meta: {
    author: "Someone",
    availableLanguages: ["de"],
    creationDate: "2020-04-12T14:23:00+0000",
  },
  questions: [
    {
      id: "q1_contact",
      text: "Gab es Kontakt zu bestätigten Fällen?",
      type: "boolean",
    },
    {
      id: "q2_contact_when",
      text: "Wann trat der Kontakt auf?",
      type: "date",
      enableWhenExpression: {
        var: "q1_contact.value",
      },
    },
  ],
  variables: [
    {
      id: "v_seconds_since_contact",
      expression: {
        "-": [
          {
            var: "g_now.value",
          },
          {
            var: "q2_contact_when.value",
          },
        ],
      },
    },
    {
      id: "v_contact_during_last_two_weeks",
      expression: {
        "<=": [
          {
            var: "v_seconds_since_contact.value",
          },
          14 * 24 * 3600,
        ],
      },
    },
  ],
  resultCategories: [
    {
      id: "rc_contact",
      description: "Kontakt",
      results: [
        {
          id: "CONTACT_RELEVANT",
          text: "Sie hatten einen relevanten Kontakt.",
          expression: {
            var: "v_contact_during_last_two_weeks.value",
          },
        },
        {
          id: "CONTACT_NOT_RELEVANT",
          text: "Sie hatten keinen relevanten Kontakt.",
          expression: {
            and: [
              { var: "q1_contact.value" },
              {
                "!": {
                  var: "v_contact_during_last_two_weeks.value",
                },
              },
            ],
          },
        },
        {
          id: "NO_CONTACT",
          text: "Sie hatten keinen Kontakt.",
          expression: true,
        },
      ],
    },
  ],
  testCases: [
    {
      description: "No contact should lead to NO_CONTACT result",
      answers: { q1_contact: false },
      results: { rc_contact: "NO_CONTACT" },
    },
    {
      description: "Contact, but longer than two weeks ago, should lead to CONTACT_NOT_RELEVANT result",
      answers: {
        q1_contact: true,
        q2_contact_when: "2020-03-01",
      },
      results: { rc_contact: "CONTACT_NOT_RELEVANT" },
      options: {
        fillInDate: "2020-03-18",
      },
    },
    {
      description: "Contact within the last two weeks should lead to CONTACT_RELEVANT result",
      answers: {
        q1_contact: true,
        q2_contact_when: "2020-03-14",
      },
      results: { rc_contact: "CONTACT_RELEVANT" },
      options: {
        fillInDate: "2020-03-18",
      },
    },
  ],
};

export default testQuestionnaire;
