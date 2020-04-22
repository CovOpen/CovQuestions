import { AnyQuestion } from "../../logic/schema";
import { ElementEditor } from "./ElementEditor";
import questionSchema from "../../schemas/question.json";
import React from "react";

export type IQuestionInStringRepresentation = Omit<AnyQuestion, "enableWhen"> & { enableWhen: string };

export type ElementEditorQuestionProps = {
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

function convertToStringRepresentation(formData: AnyQuestion): IQuestionInStringRepresentation {
  return { ...formData, enableWhen: JSON.stringify(formData.enableWhen, undefined, 2) ?? "" };
}

function convertToJsonRepresentation(formData: IQuestionInStringRepresentation): AnyQuestion {
  return {
    ...formData,
    enableWhen: formData.enableWhen !== "" ? JSON.parse(formData.enableWhen) : undefined,
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
