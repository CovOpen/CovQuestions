import { IQuestion, IQuestionnaireMeta, IResultCategory, IVariable } from "../../logic/schema";
// @ts-ignore
import jsonschema from "jsonschema";
import React from "react";
import { MuiForm } from "rjsf-material-ui";

type ElementEditorProps<T> = {
  schema: jsonschema.Schema;
  formData: T;
  onChange: (formData: T) => void;
};

export function ElementEditor<T extends IQuestionnaireMeta | IQuestion | IVariable | IResultCategory>(
  props: ElementEditorProps<T>
) {
  if (props.schema === undefined) {
    return null;
  }

  return (
    <MuiForm
      schema={props.schema}
      formData={props.formData}
      onChange={(value: { formData: T }) => {
        props.onChange(value.formData);
      }}
    >
      <div>{/* Empty div to hide submit button of MuiForm */}</div>
    </MuiForm>
  );
}
