import { AnyQuestion } from "../../models/Questionnaire";
import { ElementEditor } from "./ElementEditor";
import questionSchema from "./formEditorSchemas/question.json";
import React from "react";
import { convertLogicExpressionToString, convertStringToLogicExpression } from "./converters";

type QuestionInStringRepresentation = Omit<AnyQuestion, "enableWhen"> & { enableWhen: string };

type ElementEditorQuestionProps = {
  formData: AnyQuestion;
  onChange: (formData: AnyQuestion) => void;
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
  return (
    <ElementEditor
      schema={questionSchema as any}
      formData={convertToStringRepresentation(props.formData)}
      onChange={(formData) => props.onChange(convertToJsonRepresentation(formData))}
      uiSchema={uiSchema}
    />
  );
}
