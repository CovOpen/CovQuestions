import { IQuestion, IQuestionnaireMeta, IResultCategory, IVariable } from "../../logic/schema";
// @ts-ignore
import jsonschema from "jsonschema";
import React from "react";
import { MuiForm } from "rjsf-material-ui";

type ElementEditorProps = {
  schema: jsonschema.Schema;
  value: IQuestionnaireMeta | IQuestion | IVariable | IResultCategory;
  onChange: (value: IQuestionnaireMeta | IQuestion | IVariable | IResultCategory) => void;
};

export function ElementEditor(props: ElementEditorProps) {
  if (props.schema === undefined) {
    return null;
  }

  return (
    <MuiForm
      schema={props.schema}
      formData={props.value}
      onChange={(value: any) => {
        props.onChange(value.formData);
      }}
    >
      <div>{/* Empty div to hide submit button of MuiForm */}</div>
    </MuiForm>
  );
}
