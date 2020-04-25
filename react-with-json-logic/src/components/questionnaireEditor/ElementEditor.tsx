// @ts-ignore
import jsonschema from "jsonschema";
import React from "react";
import { MuiForm } from "rjsf-material-ui";

type ElementEditorProps<T> = {
  schema: jsonschema.Schema;
  formData: T;
  onChange: (formData: T) => void;
  uiSchema?: any;
};

export function ElementEditor<T>(props: ElementEditorProps<T>) {
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
      uiSchema={props.uiSchema}
    >
      <div>{/* Empty div to hide submit button of MuiForm */}</div>
    </MuiForm>
  );
}
