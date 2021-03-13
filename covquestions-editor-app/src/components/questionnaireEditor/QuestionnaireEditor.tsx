import { Grid } from "@material-ui/core";
import React from "react";
import { QuestionnaireFormEditor } from "./QuestionnaireFormEditor";
import { QuestionnaireJsonEditor } from "./QuestionnaireJsonEditor";
import questionnaireSchema from "../../schemas/questionnaire.json";
import { JSONSchema7 } from "json-schema";

type QuestionnaireEditorProps = {
  isJsonMode: boolean;
};

export function QuestionnaireEditor(props: QuestionnaireEditorProps) {
  const style = `
  .MuiTabs-root, .MuiTabs-scroller, .MuiTabs-flexContainer {
    margin: 0;
  }
  .rjsf .MuiBox-root {
    padding: 0;
  }
  .rjsf .MuiGrid-item {
    padding: 0px 8px 0px 8px;
  }
  .rjsf .form-group, .rjsf .panel-body {
    margin: 0;
  }
  `;

  return (
    <Grid container direction="column" className="overflow-pass-through">
      <style>{style}</style>
      <Grid item container xs={12} className="overflow-pass-through">
        {props.isJsonMode ? (
          <QuestionnaireJsonEditor schema={questionnaireSchema as JSONSchema7} />
        ) : (
          <QuestionnaireFormEditor />
        )}
      </Grid>
    </Grid>
  );
}
