import { Button, createStyles, Grid, makeStyles } from "@material-ui/core";
import React from "react";
import { QuestionnaireFormEditor } from "./QuestionnaireFormEditor";
import { QuestionnaireJsonEditor } from "./QuestionnaireJsonEditor";
import questionnaireSchema from "../../schemas/questionnaire.json";
import { useSelector } from "react-redux";
import { questionnaireJsonSelector } from "../../store/questionnaireInEditor";
import { JSONSchema7 } from "json-schema";

type QuestionnaireEditorProps = {
  resetQuestionnaire: () => void;
  isJsonMode: boolean;
};

export const heightWithoutEditor = 125;
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
  const questionnaireJson = useSelector(questionnaireJsonSelector);

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

  const downloadJson = () => {
    if (questionnaireJson === undefined) {
      return;
    }
    // after https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react/44661948
    const linkElement = document.createElement("a");
    const jsonFile = new Blob([JSON.stringify(questionnaireJson, null, 2)], { type: "text/plain" });
    linkElement.href = URL.createObjectURL(jsonFile);
    linkElement.download = questionnaireJson.id + ".json";
    document.body.appendChild(linkElement);
    linkElement.click();
  };

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
      <Grid container className={`${classes.wrapper} grid-row`} style={{ paddingLeft: 0, paddingRight: 0 }}>
        <Grid container item xs={6}>
          <Button onClick={props.resetQuestionnaire} variant="contained" color="secondary">
            Reset Questionnaire
          </Button>
        </Grid>
        <Grid container item xs={6} justify="flex-end">
          <Button onClick={downloadJson} variant="contained" color="primary">
            Download Questionnaire
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
