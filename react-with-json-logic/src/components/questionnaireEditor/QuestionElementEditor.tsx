import { IQuestion } from "../../logic/schema";
import { ElementEditor } from "./ElementEditor";
import questionSchema from "../../schemas/question.json";
import React from "react";

export type IQuestionInStringRepresentation = Omit<IQuestion, "enableWhen"> & { enableWhen: string };

export type QuestionElementEditorProps = {
  formData: IQuestion;
  onChange: (formData: IQuestion) => void;
};

const uiSchema = {
  "ui:order": ["id", "type", "text", "details", "optional", "*"],
  enableWhen: {
    "ui:widget": "textarea",
  },
};

function convertToStringRepresentation(formData: IQuestion): IQuestionInStringRepresentation {
  return { ...formData, enableWhen: JSON.stringify(formData.enableWhen, undefined, 2) ?? "" };
}

function convertToJsonRepresentation(formData: IQuestionInStringRepresentation): IQuestion {
  return { ...formData, enableWhen: JSON.parse(formData.enableWhen) } as IQuestion;
}

export function QuestionElementEditor(props: QuestionElementEditorProps) {
  return (
    <ElementEditor
      schema={questionSchema}
      formData={convertToStringRepresentation(props.formData)}
      onChange={(formData) => props.onChange(convertToJsonRepresentation(formData))}
      uiSchema={uiSchema}
    />
  );
}
