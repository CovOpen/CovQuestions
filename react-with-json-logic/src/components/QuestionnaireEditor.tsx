import { Button, Grid, ListItemText, Snackbar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Alert } from "@material-ui/lab";
import { IQuestionnaire } from "../logic/schema";
import { MuiForm } from "rjsf-material-ui";
// @ts-ignore
import jsonschema from "jsonschema";

type QuestionnaireEditorProps = {
  value: IQuestionnaire | undefined;
  schema: jsonschema.Schema | undefined;
  onChange: () => void;
  resetQuestionnaire: () => void;
  loadQuestionnaire: (newQuestionnaire: IQuestionnaire) => void;
};

export function QuestionnaireEditor(props: QuestionnaireEditorProps) {
  const [questionnaire, setQuestionnaire] = useState<IQuestionnaire>({} as IQuestionnaire);
  const [showJsonInvalidMessage, setShowJsonInvalidMessage] = useState(false);
  const [schemaValidationErrors, setSchemaValidationErrors] = useState<jsonschema.ValidationError[]>([]);

  const style = `
  .rjsf > .MuiFormControl-root  {
    height: 600px;
    overflow: auto;
  }
  .rjsf .MuiBox-root {
    padding: 0;
  }
  .rjsf .form-group, .rjsf .panel-body {
    margin: 0;
  }
  `;

  const updateQuestionnaire = () => {
    setSchemaValidationErrors([]);
    if (questionnaire === undefined) {
      return;
    }
    if (props.schema === undefined) {
      return;
    }
    try {
      const validator = new jsonschema.Validator();
      const validationResult = validator.validate(questionnaire, props.schema);
      if (validationResult.errors.length > 0) {
        setSchemaValidationErrors(validationResult.errors);
        setShowJsonInvalidMessage(true);
        return;
      }
      props.loadQuestionnaire(questionnaire);
    } catch (e) {
      setShowJsonInvalidMessage(true);
    }
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setShowJsonInvalidMessage(false);
  };

  const downloadJson = () => {
    if (questionnaire === undefined) {
      return;
    }
    // after https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react/44661948
    const linkElement = document.createElement("a");
    const jsonFile = new Blob([JSON.stringify(questionnaire, null, 2)], { type: "text/plain" });
    linkElement.href = URL.createObjectURL(jsonFile);
    linkElement.download = questionnaire.id + ".json";
    document.body.appendChild(linkElement);
    linkElement.click();
  };

  useEffect(() => {
    if (props.value === undefined) {
      setQuestionnaire({} as IQuestionnaire);
    } else {
      setQuestionnaire(props.value);
    }
  }, [props.value]);

  return (
    <Grid container direction="column">
      <style>{style}</style>
      <Grid container>
        <Grid container item xs={12} justify="flex-end">
          <Button onClick={props.resetQuestionnaire} variant="contained" color="secondary">
            Reset Questionnaire
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {props.schema !== undefined ? (
          <MuiForm
            schema={props.schema}
            formData={questionnaire}
            onChange={(value: any) => {
              console.log("new value", value);
              setQuestionnaire(value.formData);
              props.onChange();
            }}
            onSubmit={() => {
              updateQuestionnaire();
            }}
          >
            <div>
              <Button type="submit" variant="contained" color="secondary">
                Use as Questionnaire
              </Button>
              <Button onClick={downloadJson} variant="contained" color="primary">
                Download Questionnaire
              </Button>
            </div>
          </MuiForm>
        ) : null}
      </Grid>

      {schemaValidationErrors.length > 0 ? (
        <Grid item xs={12}>
          <Alert severity="error">
            Errors while validating JSON schema.
            {schemaValidationErrors.map((error, index) => (
              <ListItemText key={index} primary={error.message} />
            ))}
          </Alert>
        </Grid>
      ) : null}

      <Snackbar
        open={showJsonInvalidMessage}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          Cannot load questionnaire. JSON is invalid!
        </Alert>
      </Snackbar>
    </Grid>
  );
}
