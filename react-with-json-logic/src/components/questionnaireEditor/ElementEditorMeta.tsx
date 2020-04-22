import { QuestionnaireMeta } from "../../models/Questionnaire";
import { ElementEditor } from "./ElementEditor";
import questionnaireMetaSchema from "./formEditorSchemas/questionnaireMeta.json";
import React from "react";

type ElementEditorMetaProps = {
  formData: QuestionnaireMeta;
  onChange: (formData: QuestionnaireMeta) => void;
};

const uiSchema = {
  "ui:order": ["title", "*"],
};

export function ElementEditorMeta(props: ElementEditorMetaProps) {
  return (
    <ElementEditor
      schema={questionnaireMetaSchema as any}
      formData={props.formData}
      onChange={props.onChange}
      uiSchema={uiSchema}
    />
  );
}
