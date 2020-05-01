import React from "react";
import { fireEvent, render, RenderResult } from "@testing-library/react";
import UserEvent from "@testing-library/user-event";
import { Questionnaire } from "../../models/Questionnaire";
import { QuestionnaireExecution } from "../../components/QuestionnaireExecution";

export class QuestionnaireTest {
  public findByText: (text: string | RegExp, selector?: string) => Promise<HTMLElement>;

  private readonly renderedApp: RenderResult;

  constructor(questionnaire: Questionnaire) {
    this.renderedApp = render(<QuestionnaireExecution currentQuestionnaire={questionnaire} isJsonInvalid={false} />);

    this.findByText = (text: string | RegExp, selector: string | undefined) =>
      this.renderedApp.findByText(text, selector !== undefined ? { selector } : undefined);
  }

  public async clickOnAnswer(text: string | RegExp) {
    const option = await this.renderedApp.findByText(text);
    UserEvent.click(option);
  }

  public async enterDate(date: string) {
    const dateInputField = this.renderedApp.container.querySelector("input");
    fireEvent.change(dateInputField!, { target: { value: date } });
  }

  public async enterNumber(number: number) {
    const numericInput = (await this.renderedApp.findByTestId("NumericInput")).querySelector("input");
    fireEvent.change(numericInput!, { target: { value: number.toString() } });
  }

  public async enterText(text: string) {
    const numericInput = (await this.renderedApp.findByTestId("TextInput")).querySelector("input");
    fireEvent.change(numericInput!, { target: { value: text } });
  }

  public async clickNext() {
    const nextButton = await this.nextButton();
    UserEvent.click(nextButton);
  }

  public async nextButton() {
    return this.renderedApp.findByText(/next/i);
  }

  public async clickRestart() {
    const restartButton = await this.renderedApp.findByText(/restart questionnaire/i);
    UserEvent.click(restartButton);
  }
}
