import React from "react";
import { IQuestionnaire, QuestionType } from "../logic/schema";
import { QuestionnaireTest } from "./testUtils/QuestionnaireTest";

const testQuestionnaire: IQuestionnaire = {
  id: "testId",
  schemaVersion: "0.0.0.1",
  version: "0.0.0.1",
  meta: {
    author: "Someone",
    language: "DE",
    title: "Test Case",
    creationDate: "2020-04-10T18:48:48+0000",
  },
  questions: [
    {
      id: "q1_contact",
      text: "Gab es Kontakt zu bestätigten Fällen?",
      type: QuestionType.Boolean,
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
          value: {
            var: "q1_contact.value",
          },
        },
        {
          id: "CONTACT_NO",
          text: "Sie hatten keinen Kontakt.",
          value: {
            "!": {
              var: "q1_contact.value",
            },
          },
        },
      ],
    },
  ],
};

test("The answer 'yes' should lead to the first result", async () => {
  const test = new QuestionnaireTest(testQuestionnaire);
  await test.start();

  await test.findByText("Gab es Kontakt zu bestätigten Fällen?");
  await test.clickOnAnswer("yes");
  await test.clickNext();

  await test.findByText("Kontakt: Sie hatten Kontakt.");
});

test("The answer 'no' should lead to the second result", async () => {
  const test = new QuestionnaireTest(testQuestionnaire);
  await test.start();

  await test.findByText("Gab es Kontakt zu bestätigten Fällen?");
  await test.clickOnAnswer("no");
  await test.clickNext();

  await test.findByText("Kontakt: Sie hatten keinen Kontakt.");
});
