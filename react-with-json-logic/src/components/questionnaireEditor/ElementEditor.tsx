// @ts-ignore
import jsonschema from "jsonschema";
import React from "react";
import { MuiForm } from "rjsf-material-ui";

type ElementEditorProps<T> = {
  schema: jsonschema.Schema;
  formData: T;
  onChange: (formData: T, hasErrors: boolean) => void;
  addAdditionalValidationErrors: (formData: T, errors: any) => void;
  uiSchema?: any;
};

export function ElementEditor<T>(props: ElementEditorProps<T>) {
  const onValidate = (formData: T, errors: any) => {
    props.addAdditionalValidationErrors(formData, errors);

    return errors;
  };

  if (props.schema === undefined) {
    return null;
  }

  return (
    <MuiForm
      schema={props.schema}
      formData={props.formData}
      onChange={(value: { formData: T; errors: [] }) => {
        props.onChange(value.formData, value.errors.length > 0);
      }}
      uiSchema={props.uiSchema}
      liveValidate={true}
      showErrorList={false}
      validate={onValidate}
    >
      <div>{/* Empty div to hide submit button of MuiForm */}</div>
    </MuiForm>
  );
}
