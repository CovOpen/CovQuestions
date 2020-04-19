import { IQuestion } from "../../logic/schema";
// @ts-ignore
import jsonschema from "jsonschema";
import { useState, useEffect } from "react";
import React from "react";
import { MuiForm } from "rjsf-material-ui";

type QuestionEditorProps = {
  value: IQuestion;
  onChange: (value: IQuestion) => void;
};

export function QuestionEditor(props: QuestionEditorProps) {
  const [questionSchema, setQuestionSchema] = useState<jsonschema.Schema | undefined>(undefined);

  useEffect(() => {
    fetch("api/schema/question.json").then((response) => {
      if (response.ok) {
        response.json().then((value: jsonschema.Schema) => setQuestionSchema(value));
      }
    });
  }, []);

  if (questionSchema === undefined) {
    return null;
  }

  return (
    <MuiForm
      schema={questionSchema}
      formData={props.value}
      onChange={(value: any) => {
        props.onChange(value.formData);
      }}
    >
      <div>{/* Empty div to hide submit button of MuiForm */}</div>
    </MuiForm>
  );
}
