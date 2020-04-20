import { IResultCategory, IQuestionnaireMeta, IVariable, IQuestion } from "../../logic/schema";
// @ts-ignore
import jsonschema from "jsonschema";
import { useState, useEffect } from "react";
import React from "react";
import { MuiForm } from "rjsf-material-ui";

type ElementEditorProps = {
  schemaUrl: string;
  value: IQuestionnaireMeta | IQuestion | IVariable | IResultCategory;
  onChange: (value: IQuestionnaireMeta | IQuestion | IVariable | IResultCategory) => void;
};

export function ElementEditor(props: ElementEditorProps) {
  const [schema, setSchema] = useState<jsonschema.Schema | undefined>(undefined);

  useEffect(() => {
    fetch(props.schemaUrl).then((response) => {
      if (response.ok) {
        response.json().then((value: jsonschema.Schema) => setSchema(value));
      }
    });
  }, [props.schemaUrl]);

  if (schema === undefined) {
    return null;
  }

  return (
    <MuiForm
      schema={schema}
      formData={props.value}
      onChange={(value: any) => {
        props.onChange(value.formData);
      }}
    >
      <div>{/* Empty div to hide submit button of MuiForm */}</div>
    </MuiForm>
  );
}
