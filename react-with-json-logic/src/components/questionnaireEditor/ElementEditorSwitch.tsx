import React from "react";
import { ElementEditorMeta } from "./ElementEditorMeta";
import { ElementEditorQuestion } from "./ElementEditorQuestion";
import { ElementEditorResultCategory } from "./ElementEditorResultCategory";
import { ElementEditorVariable } from "./ElementEditorVariable";
import { ActiveItem, SectionType } from "./QuestionnaireFormEditor";
import { exhaustiveCheck } from "../../utils/exhaustiveCheck";
import { ElementEditorTestCase } from "./ElementEditorTestCase";

type ElementEditorSwitchProps = { activeItem: ActiveItem };

export function ElementEditorSwitch({ activeItem: { index, section } }: ElementEditorSwitchProps) {
  switch (section) {
    case SectionType.META:
      return <ElementEditorMeta />;
    case SectionType.QUESTIONS:
      return <ElementEditorQuestion index={index} />;
    case SectionType.RESULT_CATEGORIES:
      return <ElementEditorResultCategory index={index} />;
    case SectionType.VARIABLES:
      return <ElementEditorVariable index={index} />;
    case SectionType.TEST_CASES:
      return <ElementEditorTestCase index={index} />;
    default:
      exhaustiveCheck(section);
      return null;
  }
}
