import { Button, createStyles, FormControlLabel, Grid, ListItemText, makeStyles, Switch } from "@material-ui/core";
import React, { useState } from "react";
import { Alert } from "@material-ui/lab";
import { ValidationError } from "jsonschema";
import { QuestionnaireFormEditor } from "./QuestionnaireFormEditor";
import { QuestionnaireJsonEditor } from "./QuestionnaireJsonEditor";
import questionnaireSchema from "../../schemas/questionnaire.json";
import { useSelector } from "react-redux";
import { questionnaireJsonSelector } from "../../store/questionnaireInEditor";

type QuestionnaireEditorProps = {
  resetQuestionnaire: () => void;
  schemaValidationErrors: ValidationError[];
};

const heightWithoutEditor = 210;
// const formHeight = "calc(100vh - 210px)";
const useStyles = makeStyles(() =>
  createStyles({
    formContainer: {
      paddingLeft: "10px",
      height: `calc(100vh - ${heightWithoutEditor}px)`,
    },
    wrapper: {
      margin: 0,
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

  const [developerMode, setDeveloperMode] = useState(false);

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

  const handleDeveloperModeChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeveloperMode(event.target.checked);
  };

  return (
    <Grid container direction="column" className={classes.wrapper}>
      <style>{style}</style>
      <Grid container className={`${classes.wrapper} grid-row`}>
        <Grid container item xs={6}>
          <FormControlLabel
            control={
              <Switch
                checked={developerMode}
                onChange={handleDeveloperModeChanged}
                name="developerMode"
                color="primary"
              />
            }
            label="Developer Mode"
          />
        </Grid>
        <Grid container item xs={6} justify="flex-end">
          <Button onClick={props.resetQuestionnaire} variant="contained" color="secondary">
            Reset Questionnaire
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} className="grid-row">
        {developerMode ? (
          <QuestionnaireJsonEditor heightWithoutEditor={heightWithoutEditor} schema={questionnaireSchema} />
        ) : (
          <QuestionnaireFormEditor heightWithoutEditor={heightWithoutEditor} />
        )}
      </Grid>
      <Grid container className={`${classes.wrapper} grid-row`}>
        <Grid container item xs={6} justify="flex-end">
          <Button onClick={downloadJson} variant="contained" color="primary">
            Download Questionnaire
          </Button>
        </Grid>
      </Grid>
      {props.schemaValidationErrors.length > 0 ? (
        <Grid item xs={12} className="grid-row">
          <Alert severity="error">
            Errors while validating JSON schema.
            {props.schemaValidationErrors.map((error, index) => (
              <ListItemText key={index} primary={error.message} />
            ))}
          </Alert>
        </Grid>
      ) : null}
    </Grid>
  );
}
