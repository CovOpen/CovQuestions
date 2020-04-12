import { IQuestionnaire, QuestionType } from "../../logic/schema";

const testQuestionnaire: IQuestionnaire = {
  id: "contactQuestionWithDateVariableAndSkippingQuestion",
  schemaVersion: "1",
  version: "1",
  meta: {
    author: "Someone",
    language: "DE",
    title: "Contact question with date variable and skipping a question",
    creationDate: "2020-04-12T14:23:00+0000",
  },
  questions: [
    {
      id: "q1_contact",
      text: "Gab es Kontakt zu bestätigten Fällen?",
      type: QuestionType.Boolean,
    },
    {
      id: "q2_contact_when",
      text: "Wann trat der Kontakt auf?",
      type: QuestionType.Date,
      enableWhen: {
        var: "q1_contact.value",
      },
    },
  ],
  variables: [
    {
      id: "v_seconds_since_contact",
      value: {
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
      value: {
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
          value: {
            var: "v_contact_during_last_two_weeks.value",
          },
        },
        {
          id: "CONTACT_NOT_RELEVANT",
          text: "Sie hatten keinen relevanten Kontakt.",
          value: {
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
          value: true,
        },
      ],
    },
  ],
};

export default testQuestionnaire;
