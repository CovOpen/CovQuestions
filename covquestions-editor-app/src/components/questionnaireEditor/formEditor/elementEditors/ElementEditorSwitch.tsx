import React from "react";
import { MetaElementEditor } from "./MetaElementEditor";
import { ElementEditorQuestion } from "./QuestionElementEditor";
import { ResultCategoryElementEditor } from "./ResultCategoryElementEditor";
import { VariableElementEditor } from "./VariableElementEditor";
import { ActiveItem, SectionType } from "../../QuestionnaireFormEditor";
import { exhaustiveCheck } from "../../../../utils/exhaustiveCheck";
import { AllTestCaseView } from "./testCases/AllTestCaseView";
import { TestCaseElementEditor } from "./testCases/TestCaseElementEditor";

type ElementEditorSwitchProps = { activeItem: ActiveItem };

export function ElementEditorSwitch({ activeItem: { index, section } }: ElementEditorSwitchProps) {
  switch (section) {
    case SectionType.META:
      return <MetaElementEditor />;
    case SectionType.QUESTIONS:
      return <ElementEditorQuestion index={index} />;
    case SectionType.RESULT_CATEGORIES:
      return <ResultCategoryElementEditor index={index} />;
    case SectionType.VARIABLES:
      return <VariableElementEditor index={index} />;
    case SectionType.TEST_CASES:
      return <TestCaseElementEditor index={index} />;
    case SectionType.RUN_TEST_CASES:
      return <AllTestCaseView />;
    default:
      exhaustiveCheck(section);
      return null;
  }
}
