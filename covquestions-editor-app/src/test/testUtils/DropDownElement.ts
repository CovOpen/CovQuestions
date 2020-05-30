import UserEvent from "@testing-library/user-event";
import { waitForElementToBeRemoved, within } from "@testing-library/react";

export class DropDownElement {
  constructor(
    private readonly elementProvider: (text: string | RegExp) => Promise<HTMLElement>,
    private readonly elementText: string | RegExp
  ) {}

  public async select(optionText: string | RegExp) {
    const htmlElement: HTMLElement = await this.elementProvider(this.elementText);
    await selectMaterialUiSelectOption(htmlElement, optionText);
  }
}

const selectMaterialUiSelectOption = async (element: HTMLElement, optionText: string | RegExp) => {
  // Similar to https://github.com/testing-library/react-testing-library/issues/322#issuecomment-581650108

  const selectButton = element.parentNode!.querySelector("[role=button]");
  UserEvent.click(selectButton!);

  const listbox = document.body.querySelector("ul[role=listbox]");
  const listItem = await within(listbox as any).findByText(optionText);
  UserEvent.click(listItem);

  return waitForElementToBeRemoved(() => document.body.querySelector("ul[role=listbox]"));
};
