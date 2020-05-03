import { EditorAnyQuestion } from "../../models/editorQuestionnaire";
import { ElementEditor } from "./ElementEditor";
import questionSchema from "./formEditorSchemas/question.json";
import React from "react";
import { convertLogicExpressionToString } from "./converters";
import { editQuestion, questionInEditorSelector } from "../../store/questionnaireInEditor";
import { RootState, useAppDispatch } from "../../store/store";
import { useSelector } from "react-redux";
import { uiSchemaLogic, uiSchemaLogicReadOnly } from "./formEditorSchemas/uiSchemaLogic";

export type QuestionInStringRepresentation = Omit<EditorAnyQuestion, "enableWhenExpression"> & {
  enableWhenExpression: string;
};

type ElementEditorQuestionProps = {
  index: number;
};

const uiSchema = {
  "ui:order": ["type", "text", "details", "id", "optional", "enableWhenString", "*"],
  enableWhenExpression: uiSchemaLogicReadOnly(),
  enableWhenString: uiSchemaLogic(),
  options: {
    items: {
      "ui:order": ["text", "enableWhenString", "*"],
    },
  },
};

function convertToStringRepresentation(formData: EditorAnyQuestion): QuestionInStringRepresentation {
  return { ...formData, enableWhenExpression: convertLogicExpressionToString(formData?.enableWhenExpression) };
}

export function ElementEditorQuestion(props: ElementEditorQuestionProps) {
  const dispatch = useAppDispatch();

  const question = useSelector((state: RootState) => questionInEditorSelector(state, props));

  const onChange = (formData: QuestionInStringRepresentation, hasErrors: boolean) => {
    dispatch(editQuestion({ index: props.index, changedQuestion: formData, hasErrors: hasErrors }));
  };

  return (
    <ElementEditor
      schema={questionSchema as any}
      formData={convertToStringRepresentation(question)}
      onChange={onChange}
      uiSchema={uiSchema}
    />
  );
}
