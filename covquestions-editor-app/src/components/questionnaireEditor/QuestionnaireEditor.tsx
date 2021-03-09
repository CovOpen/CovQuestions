import { createStyles, Grid, makeStyles } from "@material-ui/core";
import React from "react";
import { QuestionnaireFormEditor } from "./QuestionnaireFormEditor";
import { QuestionnaireJsonEditor } from "./QuestionnaireJsonEditor";
import questionnaireSchema from "../../schemas/questionnaire.json";
import { JSONSchema7 } from "json-schema";

type QuestionnaireEditorProps = {
  isJsonMode: boolean;
};

export const heightWithoutEditor = 0;
const useStyles = makeStyles(() =>
  createStyles({
    formContainer: {
      paddingLeft: "10px",
      height: `calc(100vh - ${heightWithoutEditor}px)`,
    },
    wrapper: {
      margin: 0,
      paddingRight: 12,
      paddingLeft: 24,
    },
    selection: {
      height: `calc(100vh - ${heightWithoutEditor}px)`,
      overflowY: "auto",
      overflowX: "hidden",
    },
    listItem: {
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: "2px",
      paddingBottom: "2px",
    },
  })
);

export function QuestionnaireEditor(props: QuestionnaireEditorProps) {
  const classes = useStyles();

  const style = `
  .MuiTabs-root, .MuiTabs-scroller, .MuiTabs-flexContainer {
    margin: 0;
  }
  .rjsf > .MuiFormControl-root {
    height: calc(100vh - ${heightWithoutEditor}px);
    overflow-x: hidden !important;
    overflow-x: auto;
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
    <Grid container direction="column" className={classes.wrapper}>
      <style>{style}</style>
      <Grid item xs={12} className="grid-row">
        {props.isJsonMode ? (
          <QuestionnaireJsonEditor
            heightWithoutEditor={heightWithoutEditor}
            schema={questionnaireSchema as JSONSchema7}
          />
        ) : (
          <QuestionnaireFormEditor heightWithoutEditor={heightWithoutEditor} />
        )}
      </Grid>
    </Grid>
  );
}
