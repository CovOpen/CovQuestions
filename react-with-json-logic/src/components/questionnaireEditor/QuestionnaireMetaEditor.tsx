import { IQuestionnaireMeta } from "../../logic/schema";
// @ts-ignore
import jsonschema from "jsonschema";
import { useState, useEffect } from "react";
import React from "react";
import { MuiForm } from "rjsf-material-ui";

type QuestionnaireMetaEditorProps = {
  value: IQuestionnaireMeta;
  onChange: (value: IQuestionnaireMeta) => void;
};

export function QuestionnaireMetaEditor(props: QuestionnaireMetaEditorProps) {
  const [questionnaireMetaSchema, setQuestionnaireMetaSchema] = useState<jsonschema.Schema | undefined>(undefined);

  useEffect(() => {
    fetch("api/schema/questionnaireMeta.json").then((response) => {
      if (response.ok) {
        response.json().then((value: jsonschema.Schema) => setQuestionnaireMetaSchema(value));
      }
    });
  }, []);

  if (questionnaireMetaSchema === undefined) {
    return null;
  }

  return (
    <MuiForm
      schema={questionnaireMetaSchema}
      formData={props.value}
      onChange={(value: any) => {
        props.onChange(value.formData);
      }}
    >
      <div>{/* Empty div to hide submit button of MuiForm */}</div>
    </MuiForm>
  );
}
