import { JSONSchema7 } from "json-schema";
import React from "react";
import MuiForm from "@rjsf/material-ui";
import { IChangeEvent } from "@rjsf/core";

type ElementEditorProps<T> = {
  schema: JSONSchema7;
  formData: T;
  onChange: (formData: T, hasErrors: boolean) => void;
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
      onChange={(event: IChangeEvent) => {
        props.onChange(event.formData, event.errors.length > 0);
      }}
      uiSchema={props.uiSchema}
      liveValidate={true}
      showErrorList={false}
    >
      <div>{/* Empty div to hide submit button of MuiForm */}</div>
    </MuiForm>
  );
}
