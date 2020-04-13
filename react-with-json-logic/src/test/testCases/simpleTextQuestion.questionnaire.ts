import { IQuestionnaire, QuestionType } from "../../logic/schema";

const testQuestionnaire: IQuestionnaire = {
  id: "simpleTextQuestion",
  schemaVersion: "1",
  version: "1",
  meta: {
    author: "Someone",
    language: "DE",
    title: "Simple text question",
    creationDate: "2020-04-13T14:48:48+0000",
  },
  questions: [
    {
      id: "q1_text",
      text: "Geben Sie bitte 'test' ein um ein Resultat zu sehen.",
      type: QuestionType.Text,
      optional: true,
    },
  ],
  variables: [],
  resultCategories: [
    {
      id: "rc_text",
      description: "Text",
      results: [
        {
          id: "TEXT",
          text: "Sie können simple Anweisungen befolgen.",
          value: {
            "==": [{ var: "q1_text.value" }, "test"],
          },
        },
      ],
    },
  ],
};

export default testQuestionnaire;
