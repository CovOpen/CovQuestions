import React from "react";
import { MetaElementEditor } from "./MetaElementEditor";
import { ElementEditorQuestion } from "./QuestionElementEditor";
import { ResultCategoryElementEditor } from "./ResultCategoryElementEditor";
import { VariableElementEditor } from "./VariableElementEditor";
import { ActiveItem, SectionTypeSingle, SectionTypeArray } from "../../QuestionnaireFormEditor";
import { exhaustiveCheck } from "../../../../utils/exhaustiveCheck";
import { AllTestCaseView } from "./testCases/AllTestCaseView";
import { TestCaseElementEditor } from "./testCases/TestCaseElementEditor";

type ElementEditorSwitchProps = { activeItem: ActiveItem };

export function ElementEditorSwitch({ activeItem: { index, section } }: ElementEditorSwitchProps) {
  switch (section) {
    case SectionTypeSingle.META:
      return <MetaElementEditor />;
    case SectionTypeArray.QUESTIONS:
      return <ElementEditorQuestion index={index} />;
    case SectionTypeArray.RESULT_CATEGORIES:
      return <ResultCategoryElementEditor index={index} />;
    case SectionTypeArray.VARIABLES:
      return <VariableElementEditor index={index} />;
    case SectionTypeArray.TEST_CASES:
      return <TestCaseElementEditor index={index} />;
    case SectionTypeSingle.RUN_TEST_CASES:
      return <AllTestCaseView index={index} />;
    default:
      exhaustiveCheck(section);
      return null;
  }
}
