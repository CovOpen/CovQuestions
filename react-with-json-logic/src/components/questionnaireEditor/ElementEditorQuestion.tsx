import { AnyQuestion } from "../../models/Questionnaire";
import { ElementEditor } from "./ElementEditor";
import questionSchema from "./formEditorSchemas/question.json";
import React from "react";
import { convertLogicExpressionToString, convertStringToLogicExpression } from "./converters";
import { editQuestion, questionInEditorSelector } from "../../store/questionnaireInEditor";
import { RootState, useAppDispatch } from "../../store/store";
import { useSelector } from "react-redux";

type QuestionInStringRepresentation = Omit<AnyQuestion, "enableWhen"> & { enableWhen: string };

type ElementEditorQuestionProps = {
  index: number;
};

const uiSchema = {
  "ui:order": ["type", "text", "details", "id", "optional", "*"],
  enableWhen: {
    "ui:widget": "textarea",
    "ui:options": {
      rows: 5,
    },
  },
  options: {
    items: {
      "ui:order": ["text", "value", "*"],
    },
  },
};

function convertToStringRepresentation(formData: AnyQuestion): QuestionInStringRepresentation {
  return { ...formData, enableWhen: convertLogicExpressionToString(formData?.enableWhen) };
}

function convertToJsonRepresentation(formData: QuestionInStringRepresentation): AnyQuestion {
  return {
    ...formData,
    enableWhen: convertStringToLogicExpression(formData?.enableWhen),
  } as AnyQuestion;
}

export function ElementEditorQuestion(props: ElementEditorQuestionProps) {
  const dispatch = useAppDispatch();

  const question = useSelector((state: RootState) => questionInEditorSelector(state, props));

  const onChange = (formData: QuestionInStringRepresentation) => {
    dispatch(editQuestion({ index: props.index, changedQuestion: convertToJsonRepresentation(formData) }));
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
