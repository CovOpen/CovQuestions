import React from "react";
import nock from "nock";
import { render, RenderResult, within } from "@testing-library/react";
import UserEvent from "@testing-library/user-event";
import App from "../../App";
import { IQuestionnaire } from "../../logic/schema";
import { DropDownElement } from "./DropDownElement";

function nockQuestionnaire(questionnaire: IQuestionnaire) {
  const basePath = "http://localhost/api";
  const indexJson = [
    {
      name: "Test Questionnaire",
      path: "api/test.json",
    },
  ];
  nock(basePath).get("/index.json").reply(200, JSON.stringify(indexJson));
  nock(basePath).get("/test.json").reply(200, JSON.stringify(questionnaire));
}

export class QuestionnaireTest {
  public findByText: (text: string | RegExp) => Promise<HTMLElement>;
  private readonly renderedApp: RenderResult;

  constructor(questionnaire: IQuestionnaire) {
    nockQuestionnaire(questionnaire);
    this.renderedApp = render(<App />);
    this.findByText = this.renderedApp.findByText;
  }

  public async start() {
    const questionnaireSelection = new DropDownElement(
      this.renderedApp.findByText,
      /Which questionnaire/i
    );
    await questionnaireSelection.select(/Test Questionnaire/i);
  }

  public async clickOnAnswer(text: string | RegExp) {
    const questionnaireExecution = await this.renderedApp.findByTestId(
      "QuestionnaireExecution"
    );
    const option = await within(questionnaireExecution).findByText(text);
    UserEvent.click(option);
  }

  public async clickNext() {
    const questionnaireExecution = await this.renderedApp.findByTestId(
      "QuestionnaireExecution"
    );
    const nextButton = await within(questionnaireExecution).findByText(/next/i);
    UserEvent.click(nextButton);
  }
}
